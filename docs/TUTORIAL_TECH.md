# Tutorial Técnico — OmniMix

## Arquitetura

```
[Browser :5173]  ←→  [Vite/React]
                         ↓ HTTP
                 [Express :3001]
                  ↙    ↓    ↘
              [ATEM] [vMix] [PTZ]
```

## Instalação

```bash
git clone https://github.com/fernangcortes/omnimix-controller.git
npm install
node server.mjs   # Terminal 1
npm run dev       # Terminal 2
```

## API REST

| Rota | Método | Descrição |
|---|---|---|
| `/api/atem/state` | GET | PGM/PVW/connected |
| `/api/atem/inputs` | GET | Lista inputs |
| `/api/atem/cut` | POST | `{ input? }` |
| `/api/atem/preview` | POST | `{ input }` |
| `/api/atem/auto` | POST | Auto transition |
| `/api/vmix` | GET | Proxy vMix API |
| `/api/vmix/snapshot/:n` | GET | JPEG thumbnail |
| `/api/ptz/move` | POST | `{ direction, speed }` |
| `/api/ptz/preset` | POST | `{ id }` |

## Build de Produção

```bash
npm run build
NODE_ENV=production node server.mjs
# Acesse: http://localhost:3001
```
