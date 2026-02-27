/**
 * OmniMix — PTZ Camera Plugin (VISCA over IP)
 * Config: config.ptz.ip / config.ptz.port
 */
import { sendVisca, setViscaTarget } from '../visca_controller.mjs';

export const plugin = {
    name: 'PTZ Camera (VISCA)', id: 'ptz', version: '1.0.0', author: 'OmniMix',
    async connect(config) { const ip = config?.ptz?.ip; const port = config?.ptz?.port || 52381; if (ip) setViscaTarget(ip, port); },
    async disconnect() {},
    getStatus() { return { connected: true, note: 'UDP-based, stateless' }; },
};

export function getRoutes(app) {
    app.post('/api/ptz/move', (req, res) => { sendVisca('move', req.body); res.json({ status: 'sent' }); });
    app.post('/api/ptz/zoom', (req, res) => { sendVisca('zoom', req.body); res.json({ status: 'sent' }); });
    app.post('/api/ptz/focus', (req, res) => { const { mode, direction, speed } = req.body; if (mode === 'auto') sendVisca('focusAuto'); else if (mode === 'manual') sendVisca('focusManual'); else if (mode === 'onePush') sendVisca('focusOnePush'); if (direction === 'near') sendVisca('focusNear', { speed }); else if (direction === 'far') sendVisca('focusFar', { speed }); else if (direction === 'stop') sendVisca('focusStop'); res.json({ status: 'ok' }); });
    app.post('/api/ptz/preset', (req, res) => { sendVisca('preset', req.body); res.json({ status: 'sent' }); });
    app.post('/api/ptz/store-preset', (req, res) => { sendVisca('store-preset', req.body); res.json({ status: 'sent' }); });
    app.post('/api/ptz/exposure', (req, res) => { const { mode, action } = req.body; if (mode) sendVisca(`exp${mode.charAt(0).toUpperCase() + mode.slice(1)}`); if (action) sendVisca(action); res.json({ status: 'ok' }); });
    app.post('/api/ptz/wb', (req, res) => { const map = { auto: 'wbAuto', indoor: 'wbIndoor', outdoor: 'wbOutdoor', onePush: 'wbOnePush', manual: 'wbManual' }; if (map[req.body.mode]) sendVisca(map[req.body.mode]); if (req.body.action === 'trigger') sendVisca('wbTrigger'); res.json({ status: 'ok' }); });
    app.post('/api/ptz/reset', (_req, res) => { sendVisca('resetError'); res.json({ status: 'ok' }); });
    app.post('/api/ptz/menu', (req, res) => { const { action } = req.body; if (['toggle', 'enter', 'back'].includes(action)) { sendVisca('menu' + action.charAt(0).toUpperCase() + action.slice(1)); res.json({ status: 'ok' }); } else res.status(400).json({ error: 'Invalid menu action' }); });
}
