# Inteligência Transcendental

App de autoconhecimento (numerologia, tarô, astrologia, Desenho Humano e mais) feito com
**Expo + React Native + TypeScript + Expo Router**.

## Rodar no celular (Expo Go)

```
cd C:\Users\luciv\Projetos\inteligencia-transcendental
npm install
npx expo start
```

Abra o **Expo Go** no Android e leia o QR code que aparece no terminal.

## Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm test` | Testes automáticos dos cálculos |
| `npm run typecheck` | Verifica os tipos do TypeScript |
| `npm run lint` | Verifica o estilo do código |

## Estrutura

```
src/
  app/                 telas (cada arquivo é uma rota do Expo Router)
    _layout.tsx        fontes, tema, céu estrelado e proteção das rotas
    onboarding/        cadastro: boas-vindas → idioma → nome → data → hora → cidade → revisão → revelação
    (tabs)/            as 5 abas: Hoje, Meu Mapa, Relações, Oráculo, Ciclos
    profile.tsx        perfil, tema, idioma, apagar dados
  components/          peças visuais reutilizáveis (céu, logo, roda de seleção, cartas, ícones)
  features/onboarding/ estado e moldura do cadastro
  i18n/                traduções PT-BR / EN / ES
  lib/                 lógica pura e testada (fuso horário, busca de cidades)
  storage/             dados salvos no celular (perfil, preferências)
  theme/               cores, fontes e espaçamentos
  data/                base offline de cidades e países (gerada por scripts/build-cities.js)
```

## Dados

- Cidades: GeoNames (CC BY 4.0) — cidades com 15 mil+ habitantes no mundo e 1 mil+ no Brasil e em Portugal,
  com fuso horário IANA. Para regenerar, veja o topo de `scripts/build-cities.js`.
- A conversão hora local → UTC usa o `luxon`, que respeita o horário de verão histórico de cada lugar.
- Os dados de nascimento ficam só no celular.
