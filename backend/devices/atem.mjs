/**
 * OmniMix — ATEM Plugin (atem-connection)
 * Config: config.atem.ip_address
 */
import { Atem } from 'atem-connection';

const atem = new Atem();
let connected = false, reconnectTimer = null, atemIp = '10.90.0.210';

function doConnect() {
    console.log(`[ATEM] Connecting to ${atemIp}...`);
    atem.connect(atemIp).catch(e => console.error('[ATEM]', e.message));
}
atem.on('connected', () => { connected = true; console.log('[ATEM] ✅ Connected!'); if (reconnectTimer) { clearInterval(reconnectTimer); reconnectTimer = null; } });
atem.on('disconnected', () => { connected = false; console.warn('[ATEM] ❌ Disconnected'); if (!reconnectTimer) reconnectTimer = setInterval(() => { if (!connected) doConnect(); }, 10000); });

export const plugin = {
    name: 'Blackmagic ATEM', id: 'atem', version: '1.0.0', author: 'OmniMix',
    async connect(config) { atemIp = config?.atem?.ip_address || atemIp; doConnect(); },
    async disconnect() { if (reconnectTimer) clearInterval(reconnectTimer); try { atem.disconnect(); } catch {} },
    getStatus() { const me = atem.state?.video?.mixEffects?.[0]; return { connected, program: me?.programInput ?? null, preview: me?.previewInput ?? null }; },
};

export function getRoutes(app) {
    app.get('/api/atem/state', (_req, res) => res.json(plugin.getStatus()));
    app.get('/api/atem/inputs', (_req, res) => {
        if (!connected) return res.json({ connected: false, inputs: [] });
        const raw = atem.state?.settings?.inputs || {};
        res.json({ connected: true, inputs: Object.entries(raw).map(([id, inp]) => ({ id: parseInt(id), name: inp.longName || `Input ${id}`, shortName: inp.shortName || String(id) })).filter(i => i.id > 0 && i.id < 2000) });
    });
    app.post('/api/atem/cut', async (req, res) => { if (!connected) return res.status(503).json({ error: 'ATEM not connected' }); try { const { input } = req.body; if (input !== undefined) await atem.changeProgramInput(parseInt(input), 0); else await atem.cut(0); res.json({ status: 'ok' }); } catch (e) { res.status(500).json({ error: e.message }); } });
    app.post('/api/atem/preview', async (req, res) => { if (!connected) return res.status(503).json({ error: 'ATEM not connected' }); try { await atem.changePreviewInput(parseInt(req.body.input), 0); res.json({ status: 'ok' }); } catch (e) { res.status(500).json({ error: e.message }); } });
    app.post('/api/atem/auto', async (req, res) => { if (!connected) return res.status(503).json({ error: 'ATEM not connected' }); try { await atem.autoTransition(0); res.json({ status: 'ok' }); } catch (e) { res.status(500).json({ error: e.message }); } });
    app.post('/api/atem/fade', async (req, res) => { if (!connected) return res.status(503).json({ error: 'ATEM not connected' }); try { const { input } = req.body; if (input !== undefined) await atem.changePreviewInput(parseInt(input), 0); await atem.autoTransition(0); res.json({ status: 'ok' }); } catch (e) { res.status(500).json({ error: e.message }); } });
}
