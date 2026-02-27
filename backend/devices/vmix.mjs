/**
 * OmniMix — vMix Plugin
 * Config: config.vmix.url
 */
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

let vmixUrl = 'http://127.0.0.1:8088/api', stateCache = null, pollInterval = null;

async function fetchState() {
    try {
        const res = await axios.get(vmixUrl, { timeout: 2000 });
        const parsed = await parseStringPromise(res.data, { explicitArray: false, mergeAttrs: true });
        if (parsed.vmix?.inputs?.input) {
            const inputs = Array.isArray(parsed.vmix.inputs.input) ? parsed.vmix.inputs.input : [parsed.vmix.inputs.input];
            stateCache = { ...parsed.vmix, inputs };
        }
    } catch {}
}

export const plugin = {
    name: 'vMix', id: 'vmix', version: '1.0.0', author: 'OmniMix',
    async connect(config) { vmixUrl = config?.vmix?.url || vmixUrl; if (!/\/api$/.test(vmixUrl)) vmixUrl += '/api'; console.log(`[vMix] Polling ${vmixUrl}`); await fetchState(); pollInterval = setInterval(fetchState, 2000); },
    async disconnect() { if (pollInterval) clearInterval(pollInterval); },
    getStatus() { return { connected: !!stateCache, inputCount: stateCache?.inputs?.length ?? 0 }; },
};

export function getRoutes(app) {
    app.get('/api/vmix', async (req, res) => { try { const vres = await axios.get(`${vmixUrl}?${new URLSearchParams(req.query)}`, { timeout: 5000 }); res.send(vres.data); } catch (e) { res.status(500).json({ error: e.message }); } });
    app.get('/api/vmix/state', (_req, res) => res.json(plugin.getStatus()));
    app.get('/api/vmix/snapshot/:input', async (req, res) => { try { const r = await axios.get(`http://127.0.0.1:8088/?Function=Snapshot&Input=${req.params.input}`, { responseType: 'arraybuffer', timeout: 3000 }); res.setHeader('Content-Type', 'image/jpeg'); res.send(r.data); } catch (e) { res.status(502).json({ error: e.message }); } });
    app.post('/api/log', (req, res) => { const { action, details, timestamp } = req.body; process.stdout.write(`[LOG] ${timestamp || new Date().toISOString()} ${action}: ${JSON.stringify(details)}\n`); res.json({ status: 'ok' }); });
}
