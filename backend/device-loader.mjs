/**
 * OmniMix Device Loader — auto-loads backend/devices/*.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEVICES_DIR = path.join(__dirname, 'devices');
let loadedPlugins = [];

export async function loadDevices(app, config) {
    const files = fs.readdirSync(DEVICES_DIR).filter(f => f.endsWith('.mjs') && f !== 'TEMPLATE.mjs');
    for (const file of files) {
        const filePath = path.join(DEVICES_DIR, file);
        try {
            const mod = await import(`file://${filePath}`);
            if (!mod.plugin || !mod.getRoutes) { console.warn(`[devices] ${file}: skipping`); continue; }
            mod.getRoutes(app, config);
            await mod.plugin.connect(config);
            loadedPlugins.push({ plugin: mod.plugin, module: mod });
            console.log(`[devices] ✅ Loaded: ${mod.plugin.name} v${mod.plugin.version}`);
        } catch (e) { console.error(`[devices] ❌ ${file}:`, e.message); }
    }
    console.log(`[devices] ${loadedPlugins.length} device(s) loaded.`);
}

export async function unloadDevices() {
    for (const { plugin } of loadedPlugins) try { await plugin.disconnect(); } catch {}
}

export function getDeviceStatuses() {
    return loadedPlugins.map(({ plugin }) => ({ id: plugin.id, name: plugin.name, version: plugin.version, ...plugin.getStatus() }));
}
