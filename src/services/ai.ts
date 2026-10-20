/**
 * Chamadas ao servidor de IA (pasta backend/). A chave da IA fica só no servidor.
 * O app envia apenas resultados calculados e o primeiro nome — nunca data, hora ou local de nascimento.
 */
import type { Lang } from '@/content/types';
import { kv } from '@/storage/kv';
import { CONFIG } from './config';

export const aiEnabled = () => !!CONFIG.aiUrl;

function deviceId() {
  let id = kv.getString('device.id');
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    kv.setString('device.id', id);
  }
  return id;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch(`${CONFIG.aiUrl.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Device-Id': deviceId() },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`IA ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export type SynthesisPayload = { lang: Lang; firstName: string; data: Record<string, unknown> };

export function aiSynthesis(payload: SynthesisPayload) {
  return post<{ sections: Record<string, string> }>('/synthesis', payload);
}

export type OraclePayload = { lang: Lang; firstName: string; question: string; spread: string; cards: { name: string; position: string; reversed: boolean; meaning: string }[]; profile: Record<string, unknown> };

export function aiOracle(payload: OraclePayload) {
  return post<{ answer: string }>('/oracle', payload);
}

export type RelationPayload = { lang: Lang; names: [string, string]; data: Record<string, unknown> };

export function aiRelation(payload: RelationPayload) {
  return post<{ unites: string; clashes: string; tips: string }>('/relation', payload);
}
