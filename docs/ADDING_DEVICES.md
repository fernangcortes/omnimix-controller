# Adicionando Novos Dispositivos — OmniMix

## Como funciona

Qualquer arquivo `.mjs` em `backend/devices/` é carregado automaticamente.

## Passo a passo

### 1. Copie o template
```bash
cp backend/devices/TEMPLATE.mjs backend/devices/meu_dispositivo.mjs
```

### 2. Preencha o plugin
```javascript
export const plugin = {
    name: 'Mesa de Áudio',
    id: 'audio-desk',
    version: '1.0.0',
    async connect(config) { /* conectar ao hardware */ },
    async disconnect() { /* fechar conexão */ },
    getStatus() { return { connected: false }; },
};
```

### 3. Registre as rotas
```javascript
export function getRoutes(app, config) {
    app.get('/api/audio-desk/state', (req, res) => res.json(plugin.getStatus()));
    app.post('/api/audio-desk/fader', async (req, res) => {
        // enviar comando
        res.json({ status: 'ok' });
    });
}
```

### 4. Reinicie e pronto
```bash
node server.mjs
# [devices] ✅ Loaded: Mesa de Áudio (audio-desk) v1.0.0
```

## Dispositivos sugeridos

| Dispositivo | Protocolo | npm |
|---|---|---|
| Mesa Yamaha | OSC | `osc` |
| Luzes DMX | Art-Net | `artnet` |
| Teleprompter | WebSocket | `ws` |
| Relógio de ar | Serial | `serialport` |
