# OmniMix Controller

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)

> **A modular, extensible broadcast control surface for vMix, ATEM, PTZ cameras, and beyond.**

OmniMix is a web-based touchscreen controller built for live production. It runs in any browser, connects to your broadcast hardware, and lets you build custom control panels with buttons, faders, timelines, camera controls, and arrow-based workflow sequences — all without writing a single line of code.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎛️ **Custom Widgets** | Drag-and-drop canvas with Buttons, Labels, Faders, Timers, Groups, and more |
| 🔀 **Arrow Workflow** | Connect widgets with directional arrows to define execution sequences |
| ⏭️ **Sequencer** | Auto-discovers all arrow chains — NEXT/PREV without any configuration |
| 📺 **vMix Integration** | Full API control — cut, transition, input switching, live preview |
| 🎬 **ATEM Integration** | Native connection via `atem-connection` — cut, auto, preview, inputs |
| 📷 **PTZ Camera** | VISCA over IP — pan, tilt, zoom, focus, presets, exposure, white balance |
| 🧩 **Plugin System** | Add new devices by dropping a `*.mjs` file in `backend/devices/` |
| 🌙 **Dark UI** | Designed for dimly-lit production environments |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- Windows (or Linux/macOS)
- vMix (optional) at `127.0.0.1:8088`
- Blackmagic ATEM (optional) — configure IP in `backend/config.json`

### Install & Run

```bash
git clone https://github.com/fernangcortes/omnimix-controller.git
cd omnimix-controller
npm install

# Terminal 1: Backend
node server.mjs

# Terminal 2: Frontend
npm run dev
```

Or just double-click **`start.bat`** on Windows.

Open **http://localhost:5173** in your browser.

---

## ⚙️ Configuration

Edit `backend/config.json`:

```json
{
  "atem": { "ip_address": "10.90.0.210" },
  "vmix": { "url": "http://127.0.0.1:8088" },
  "ptz":  { "ip": "10.90.0.159", "port": 52381 }
}
```

---

## 🧩 Adding a New Device

1. Copy `backend/devices/TEMPLATE.mjs` to `backend/devices/mydevice.mjs`
2. Fill in the `plugin` object and `getRoutes()` function
3. Restart `server.mjs` — your device is auto-loaded

See [`docs/ADDING_DEVICES.md`](docs/ADDING_DEVICES.md) for a complete guide.

---

## 📁 Project Structure

```
omnimix-controller/
├── src/                        # React frontend
│   ├── App.tsx                 # Main application
│   ├── types.ts                # TypeScript types
│   └── components/             # Widget components
│       ├── SequencerWidget.tsx # Auto-chain sequencer
│       ├── PTZWidget.tsx       # Camera control
│       └── TimelineWidget.tsx  # Automation timeline
├── backend/
│   ├── devices/                # 🧩 Device plugins (auto-loaded)
│   │   ├── atem.mjs            # Blackmagic ATEM
│   │   ├── vmix.mjs            # vMix
│   │   ├── ptz.mjs             # PTZ Camera (VISCA)
│   │   └── TEMPLATE.mjs        # Starter template
│   ├── device-loader.mjs       # Plugin discovery & loading
│   ├── visca_controller.mjs    # VISCA over IP protocol
│   └── config.json             # Device IP / URL settings
├── server.mjs                  # Express backend entry point
├── docs/                       # Documentation
└── index.html                  # Web app entry point
```

---

## 📖 Documentation

| Document | Description |
|---|---|
| [Tutorial: Beginner](docs/TUTORIAL_BEGINNER.md) | Start here if you're new to vMix or live production |
| [Tutorial: Technical](docs/TUTORIAL_TECH.md) | Developer setup, API reference, widget props |
| [Adding Devices](docs/ADDING_DEVICES.md) | Step-by-step guide for new device plugins |

---

## 🛠️ Built With

- **React 18** + **TypeScript** — frontend UI
- **Vite 5** — fast dev server and build tool
- **Express.js** — backend API server
- **atem-connection** — native ATEM SDK (Node.js)
- **react-xarrows** — arrow connection rendering
- **react-grid-layout** — draggable widget canvas

---

## 📄 License

MIT © OmniMix Contributors
