/**
 * Servidor de IA da Inteligência Transcendental (Cloudflare Worker).
 *
 * - A chave da Anthropic fica só aqui (segredo ANTHROPIC_API_KEY), nunca no app.
 * - O app manda apenas resultados já calculados e o primeiro nome (nunca data, hora ou local).
 * - Limite diário por aparelho e cache das respostas no KV.
 */
import Anthropic from '@anthropic-ai/sdk';

export interface Env {
  ANTHROPIC_API_KEY: string;
  CACHE: KVNamespace;
  /** Máximo de chamadas de IA por aparelho por dia (padrão 20). */
  DAILY_LIMIT?: string;
}

type Lang = 'pt' | 'en' | 'es';
const LANG_NAME: Record<Lang, string> = { pt: 'Brazilian Portuguese', en: 'English', es: 'Spanish (neutral Latin American)' };

const MODEL = 'claude-opus-5-5';

const STYLE = `You write for "Inteligência Transcendental", a self-knowledge app that combines numerology, tarot, astrology, Human Design, Chinese astrology and Kabbalistic angels.
Tone: warm, direct, no jargon, short sentences. Speak to the person in the second person.
Use the language of possibility ("tends to", "may", "can"), never of fixed fate.
Never make predictions about health, illness, death, pregnancy, accidents or guaranteed money, and never promise a cure.
Only use the calculated data you receive; never invent other placements or numbers.
This content is for self-knowledge and entertainment.`;

const SYNTHESIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['who', 'gifts', 'challenges', 'love', 'work', 'now'],
  properties: {
    who: { type: 'string', description: 'Who you are: 3–5 sentences.' },
    gifts: { type: 'string', description: 'Your gifts: 3–4 sentences. Highlight where several techniques agree.' },
    challenges: { type: 'string', description: 'Your challenges: 3–4 sentences, kind and constructive.' },
    love: { type: 'string', description: 'Love and relationships: 3–4 sentences.' },
    work: { type: 'string', description: 'Work and purpose: 3–4 sentences.' },
    now: { type: 'string', description: 'Your current moment (personal year, year arcana): 3–4 sentences.' },
  },
};

const ORACLE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['answer'],
  properties: { answer: { type: 'string', description: 'Conversational interpretation in 3–5 short paragraphs separated by blank lines.' } },
};

const RELATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['unites', 'clashes', 'tips'],
  properties: {
    unites: { type: 'string', description: 'What unites them: 2–4 sentences.' },
    clashes: { type: 'string', description: 'Where they may clash: 2–4 sentences.' },
    tips: { type: 'string', description: 'How to understand each other better: 2–4 sentences.' },
  },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Device-Id' },
  });

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Conta uma chamada para o aparelho; devolve false se passou do limite do dia. */
async function allow(env: Env, device: string) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `rate:${device}:${day}`;
  const used = Number((await env.CACHE.get(key)) ?? '0');
  if (used >= Number(env.DAILY_LIMIT ?? '20')) return false;
  await env.CACHE.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 });
  return true;
}

async function generate(env: Env, user: string, schema: Record<string, unknown>, maxTokens: number) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: STYLE,
    // Textos curtos e criativos: esforço baixo mantém a resposta rápida e barata.
    output_config: { effort: 'low', format: { type: 'json_schema', schema } },
    // Se o filtro de segurança recusar por engano, a API tenta o modelo recomendado.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    messages: [{ role: 'user', content: user }],
  });
  if (response.stop_reason === 'refusal') throw new Error('refusal');
  const text = response.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
  return JSON.parse(text) as Record<string, string>;
}

function isLang(x: unknown): x is Lang {
  return x === 'pt' || x === 'en' || x === 'es';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return json({});
    if (request.method !== 'POST') return json({ error: 'method' }, 405);
    const path = new URL(request.url).pathname;
    const device = request.headers.get('X-Device-Id') ?? 'anon';

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: 'bad json' }, 400);
    }
    if (!isLang(body.lang)) return json({ error: 'lang' }, 400);
    const lang = body.lang;

    // Respostas iguais para os mesmos dados saem do cache (Síntese e Relações; o Oráculo é sempre novo).
    const cacheKey = path === '/oracle' ? null : `resp:${path}:${await sha256(JSON.stringify(body))}`;
    if (cacheKey) {
      const hit = await env.CACHE.get(cacheKey);
      if (hit) return json(JSON.parse(hit));
    }
    if (!(await allow(env, device))) return json({ error: 'limit' }, 429);

    try {
      let result: Record<string, string>;
      if (path === '/synthesis') {
        const name = String(body.firstName ?? '').slice(0, 40);
        result = await generate(
          env,
          `Write the "Transcendental Synthesis" for ${name} in ${LANG_NAME[lang]}.\nCross the techniques below and make convergences explicit (e.g. "three techniques point to leadership").\nCalculated data (JSON):\n${JSON.stringify(body.data).slice(0, 6000)}`,
          SYNTHESIS_SCHEMA,
          4000
        );
        result = { sections: result } as unknown as Record<string, string>;
      } else if (path === '/oracle') {
        const name = String(body.firstName ?? '').slice(0, 40);
        const question = String(body.question ?? '').slice(0, 400);
        result = await generate(
          env,
          `Interpret a tarot reading for ${name} in ${LANG_NAME[lang]}.\nQuestion: "${question}"\nCards drawn (with positions and base meanings): ${JSON.stringify(body.cards).slice(0, 2000)}\nPerson's calculated profile, to personalize the reading: ${JSON.stringify(body.profile).slice(0, 4000)}\nWrite as a warm, wise person talking directly to ${name} (second person, natural spoken language, no lists, no headings). Start by addressing the question itself, using its specific details. Weave the cards together (how each one relates to the others and to the question) instead of describing them one by one in isolation. If the question can be answered yes or no, give a clear, honest answer. Bring in one or two details of the profile only when they genuinely relate to the question. End with concrete, practical advice for the next few days and gently remind that the choice is theirs.`,
          ORACLE_SCHEMA,
          2000
        );
      } else if (path === '/relation') {
        const names = Array.isArray(body.names) ? body.names.slice(0, 2).map((n) => String(n).slice(0, 40)) : ['', ''];
        result = await generate(
          env,
          `Write a compatibility reading for ${names[0]} and ${names[1]} in ${LANG_NAME[lang]}.\nCalculated compatibility data (synastry, numerology, Chinese zodiac, Human Design): ${JSON.stringify(body.data).slice(0, 4000)}`,
          RELATION_SCHEMA,
          2000
        );
      } else {
        return json({ error: 'not found' }, 404);
      }
      if (cacheKey) await env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 60 * 60 * 24 * 30 });
      return json(result);
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) return json({ error: 'busy' }, 503);
      if (e instanceof Anthropic.APIError) return json({ error: 'ai' }, 502);
      return json({ error: 'unavailable' }, 502);
    }
  },
};
