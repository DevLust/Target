# Target

Aplicativo de **metas financeiras** feito com [Expo](https://expo.dev/) e [Expo Router](https://docs.expo.dev/router/introduction/). O usuário cria metas, acompanha o progresso e registra transações de guardar e resgatar.

## Requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- npm (vem com o Node)

## Como rodar

```bash
npm install
npx expo start
```

Depois escolha a plataforma no terminal (tecla **w** para web, **a** para Android, **i** para iOS no macOS) ou use:

| Plataforma | Comando |
|------------|---------|
| Web | `npm run web` ou `npx expo start --web` |
| Android | `npm run android` |
| iOS (macOS) | `npm run ios` |

Se alterar dependências ou configuração do Metro/Babel, use `npx expo start --clear`.

## Estrutura principal

- `src/app/` — rotas (Expo Router): home, meta, progresso, transação
- `src/components/` — componentes de UI reutilizáveis
- `src/theme/` — tokens de cor e fonte
- `src/data/` — dados de exemplo (substituível por persistência depois)
- `assets/` — ícones e imagens do app

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o bundler do Expo |
| `npm run web` | Inicia com foco na web |
| `npm run android` / `npm run ios` | Abre no emulador/dispositivo |

## Licença

Uso educacional / projeto pessoal, salvo indicação em contrário.
