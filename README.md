# Inteligência Transcendental

App de autoconhecimento (numerologia, arcanos e tarô, astrologia, Desenho Humano, astrologia chinesa e Ba Zi,
anjo cabalístico, oráculos, chakras e cristais) com a **Síntese Transcendental** feita por IA.
Feito com **Expo + React Native + TypeScript + Expo Router**. Idiomas: PT-BR, EN e ES.

> Os comandos abaixo são para o **Windows** (Prompt de Comando ou PowerShell). Sempre rode o `cd` antes.

## 0. Abrir direto pelo link (GitHub Pages), sem instalar nada

A cada envio para o branch `main`, o GitHub publica o app como site em
`https://musictranscendente-cyber.github.io/inteligencia-transcendental/`.
Ative uma vez em **Settings → Pages → Source: GitHub Actions**. No celular, abra o link no Chrome e toque em
**⋮ → Adicionar à tela inicial**. No site, os dados ficam salvos no navegador; lembretes diários e compras só no app instalado.

## 1. Testar no celular Android (Expo Go) — o jeito mais rápido

1. Instale o **Node.js LTS** (nodejs.org) no computador e o app **Expo Go** (Play Store) no celular.
2. Computador e celular na **mesma rede Wi-Fi**.
3. No terminal:

```
cd C:\Users\luciv\Projetos\Rift-Rumble-\inteligencia-transcendental
npm install
npx expo start
```

4. No Expo Go, toque em **Scan QR code** e leia o QR que apareceu no terminal.

Se não conectar (rede da empresa, roteador bloqueando), use:

```
cd C:\Users\luciv\Projetos\Rift-Rumble-\inteligencia-transcendental
npx expo start --tunnel
```

No Expo Go **tudo fica liberado** (modo de teste, sem cobrança). A Síntese, o Oráculo e Relações usam
textos offline até você publicar o servidor de IA (passo 3).

## 2. Configurar (arquivo `.env`)

Copie `.env.example` para `.env` e preencha só o que for usar:

```
cd C:\Users\luciv\Projetos\Rift-Rumble-\inteligencia-transcendental
copy .env.example .env
notepad .env
```

| Variável | Para quê |
| --- | --- |
| `EXPO_PUBLIC_AI_URL` | Endereço do servidor de IA (passo 3). Vazio = textos offline. |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` / `_IOS_KEY` | Chaves públicas do RevenueCat. Vazio = tudo liberado. |
| `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT` | Nome do direito no RevenueCat (padrão `premium`). |
| `EXPO_PUBLIC_SHARE_URL` | Link que aparece nos cards compartilhados. |
| `EXPO_PUBLIC_MEDITATION_APP_URL` | Link para o app de meditação (opcional). |

Depois de mudar o `.env`, pare o servidor (Ctrl+C) e rode `npx expo start -c`.

## 3. Ligar a inteligência artificial

Siga [backend/README.md](backend/README.md). Em resumo: conta grátis na Cloudflare + chave da Anthropic,
quatro comandos, e cole o endereço em `EXPO_PUBLIC_AI_URL`.

## 4. Assinaturas (RevenueCat) e notificações de verdade — build de desenvolvimento

Compras não funcionam no Expo Go. Para testá-las, gere um APK de desenvolvimento com o EAS (grátis):

```
cd C:\Users\luciv\Projetos\Rift-Rumble-\inteligencia-transcendental
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --profile development --platform android
```

Instale o APK do link que aparece e rode `npx expo start --dev-client`.

No RevenueCat: crie o projeto, ligue ao app da Play Store, crie o direito `premium`, os produtos
(mensal, anual e vitalício) e uma *offering* padrão com esses pacotes. O paywall lê a offering sozinho.

## 5. Publicar na Play Store

```
cd C:\Users\luciv\Projetos\Rift-Rumble-\inteligencia-transcendental
npx eas-cli@latest build --profile production --platform android
npx eas-cli@latest submit --platform android
```

Textos da loja nos 3 idiomas: [docs/STORE.md](docs/STORE.md). Política de privacidade: [docs/PRIVACY.md](docs/PRIVACY.md)
(publique-a num link público, por exemplo GitHub Pages ou Google Sites, e informe na Play Console).

## Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm test` | Testes automáticos dos cálculos e textos |
| `npm run typecheck` | Verifica os tipos do TypeScript |
| `npm run lint` | Verifica o estilo do código |
| `npx expo start --web` | Abre no navegador do computador |

## Estrutura

```
src/
  app/                 telas (cada arquivo é uma rota do Expo Router)
    onboarding/        cadastro e revelação do mapa
    (main)/(tabs)/     as 5 abas: Hoje, Meu Mapa, Relações, Oráculo, Ciclos
    (main)/reading/    detalhes de cada técnica e a Síntese
    (main)/oracle/     tiragens, I Ching, Pergunte ao Oráculo, histórico
    (main)/relations/  pessoas e compatibilidade
  engines/             cálculos puros e testados (numerologia, efemérides, casas, Desenho Humano, Ba Zi…)
  content/             banco de textos PT/EN/ES
  components/          peças visuais (gráficos, roda natal, bodygraph, cartas, cards de compartilhar)
  services/            IA, RevenueCat, notificações
  storage/             dados salvos só no celular
  i18n/                traduções da interface
  data/                base offline de cidades (gerada por scripts/build-cities.js)
backend/               servidor de IA (Cloudflare Worker)
docs/                  textos da loja e política de privacidade
```

## Dados e privacidade

- Cidades: GeoNames (CC BY 4.0), com fuso horário IANA; a conversão para UTC respeita o horário de verão histórico.
- Posições planetárias: `astronomy-engine` (MIT), calculadas no próprio celular.
- Data, hora e local de nascimento ficam **só no celular** e nunca vão nos cards nem para a IA.
- Conteúdo para autoconhecimento e entretenimento; sem previsões de saúde, morte ou dinheiro garantido.
