/**
 * OmniMix Device Plugin Template
 * Copy to backend/devices/YOUR_DEVICE.mjs — auto-loaded on server start.
 */
export const plugin = {
    name: 'My Device', id: 'my-device', version: '1.0.0', author: 'Your Name',
    async connect(config) { console.log('[MY DEVICE] Connecting...'); },
    async disconnect() { console.log('[MY DEVICE] Disconnecting...'); },
    getStatus() { return { connected: false }; },
};

export function getRoutes(app, config) {
    app.get('/api/my-device/state', (req, res) => res.json(plugin.getStatus()));
    app.post('/api/my-device/action', async (req, res) => {
        try { res.json({ status: 'ok', ...req.body }); }
        catch (e) { res.status(500).json({ error: e.message }); }
    });
}
