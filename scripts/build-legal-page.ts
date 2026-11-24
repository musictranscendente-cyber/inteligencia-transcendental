/**
 * Gera public/privacy.html (política de privacidade e termos, nos 6 idiomas) a partir de src/content/legal.ts.
 * O site do GitHub Pages publica esse arquivo; o link vai na Play Store.
 * Uso: npx tsx scripts/build-legal-page.ts
 */
import { writeFileSync } from 'node:fs';

import { LEGAL, LEGAL_UPDATED } from '../src/content/legal';
import type { Lang } from '../src/content/types';

const LANGS: [Lang, string, string, string][] = [
  ['pt', 'Português', 'Política de privacidade', 'Termos de uso'],
  ['en', 'English', 'Privacy policy', 'Terms of use'],
  ['es', 'Español', 'Política de privacidad', 'Términos de uso'],
  ['fr', 'Français', 'Politique de confidentialité', 'Conditions d’utilisation'],
  ['de', 'Deutsch', 'Datenschutzerklärung', 'Nutzungsbedingungen'],
  ['it', 'Italiano', 'Informativa sulla privacy', 'Termini d’uso'],
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sections = (lang: Lang, doc: 'privacy' | 'terms') =>
  LEGAL[doc][lang].map((s) => `<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>`).join('\n');

const body = LANGS.map(
  ([lang, label, privacy, terms]) => `<section id="${lang}" lang="${lang}">
<h2>${label}</h2>
<h2 class="doc">${privacy}</h2>
${sections(lang, 'privacy')}
<h2 class="doc">${terms}</h2>
${sections(lang, 'terms')}
</section>`
).join('\n');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Inteligência Transcendental · Privacidade e termos</title>
<style>
:root { color-scheme: dark; }
body { margin: 0; background: #0B0A1A; color: #F2EEE6; font: 16px/1.6 system-ui, sans-serif; }
main { max-width: 720px; margin: 0 auto; padding: 32px 16px 64px; }
h1 { font-family: Georgia, serif; font-weight: 600; margin: 0 0 4px; }
h2 { font-family: Georgia, serif; color: #D9B56A; margin: 48px 0 8px; }
h2.doc { color: #F2EEE6; font-size: 1.2rem; margin-top: 24px; }
h3 { font-size: 1rem; margin: 20px 0 4px; }
p { margin: 0; color: rgba(242, 238, 230, .8); }
nav { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
a { color: #D9B56A; }
small { color: rgba(242, 238, 230, .6); }
</style>
</head>
<body>
<main>
<h1>Inteligência Transcendental</h1>
<small>${LEGAL_UPDATED}</small>
<nav>${LANGS.map(([lang, label]) => `<a href="#${lang}">${label}</a>`).join('')}</nav>
${body}
</main>
</body>
</html>
`;

writeFileSync(new URL('../public/privacy.html', import.meta.url), html);
console.log('public/privacy.html gerado');
