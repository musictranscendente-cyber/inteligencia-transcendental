# Servidor de IA (Cloudflare Worker)

Gera a Síntese Transcendental, as respostas do "Pergunte ao Oráculo" e os textos de compatibilidade.
A chave da Anthropic fica **só aqui**; o app nunca a vê. O app envia apenas resultados já calculados e o
primeiro nome — nunca data, hora ou local de nascimento.

- Modelo: `claude-opus-5-5`, esforço `low` (textos curtos), saída em JSON estruturado.
- Limite de 20 chamadas por aparelho por dia (mude `DAILY_LIMIT` em `wrangler.toml`).
- Respostas da Síntese e de Relações ficam em cache por 30 dias (mesmos dados = mesma resposta, sem custo).

## Publicar (uma vez)

Você precisa de uma conta grátis na Cloudflare e de uma chave da API da Anthropic (console.anthropic.com).

```
cd C:\Users\luciv\Projetos\inteligencia-transcendental\backend
npm install
npx wrangler login
npx wrangler kv namespace create CACHE
```

Copie o `id` que apareceu e cole no lugar de `COLE_AQUI_O_ID_DO_KV` em `wrangler.toml`. Depois:

```
cd C:\Users\luciv\Projetos\inteligencia-transcendental\backend
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

O comando mostra um endereço como `https://inteligencia-transcendental-ai.SEU-USUARIO.workers.dev`.
Coloque-o no arquivo `.env` do app:

```
EXPO_PUBLIC_AI_URL=https://inteligencia-transcendental-ai.SEU-USUARIO.workers.dev
```

## Rotas

| Rota | Recebe | Devolve |
| --- | --- | --- |
| `POST /synthesis` | `{ lang, firstName, data }` | `{ sections: { who, gifts, challenges, love, work, now } }` |
| `POST /oracle` | `{ lang, firstName, question, spread, cards, profile }` | `{ answer }` |
| `POST /relation` | `{ lang, names, data }` | `{ unites, clashes, tips }` |

Cabeçalho `X-Device-Id` identifica o aparelho para o limite diário. Se a IA falhar, o app mostra a versão offline.
