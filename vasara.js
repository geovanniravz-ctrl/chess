const vasara = function () {
    const mousePosition = { x: 0, y: 0 };
    const mouseButtons = new Map();

    const palettes = [
        { name: "Golden Night", bg:"#1e1e24", surface:"#2a2a30", text:"#f0e6d2", accent:"#f5c518", accentH:"#ffdd57", border:"rgba(255,215,0,0.2)", shadow:"rgba(0,0,0,0.4)", rating:"#f5c518" },
        { name: "Pink (Default)", bg:"#1e1b1e", surface:"#2b2329", text:"#f0dce0", accent:"#d88c9a", accentH:"#f0a6b3", border:"rgba(216,140,154,0.25)", shadow:"rgba(0,0,0,0.35)", rating:"#d88c9a" },
        { name: "Ocean Mint", bg:"#1b2223", surface:"#253031", text:"#d4f0e0", accent:"#66d9a0", accentH:"#8ef2b5", border:"rgba(102,217,160,0.2)", shadow:"rgba(0,0,0,0.4)", rating:"#66d9a0" },
        { name: "Lavender Dusk", bg:"#1f1b24", surface:"#2b2432", text:"#e4d2f0", accent:"#b48cd9", accentH:"#d0a5f0", border:"rgba(180,140,217,0.25)", shadow:"rgba(0,0,0,0.4)", rating:"#b48cd9" },
        { name: "Copper Ember", bg:"#1e1c18", surface:"#2b261f", text:"#f0dcc2", accent:"#e08b5a", accentH:"#f5a97a", border:"rgba(224,139,90,0.3)", shadow:"rgba(0,0,0,0.45)", rating:"#e08b5a" },
        { name: "Arctic Frost", bg:"#1a2026", surface:"#243039", text:"#cdeaf0", accent:"#5dc9e2", accentH:"#80dff5", border:"rgba(93,201,226,0.25)", shadow:"rgba(0,0,0,0.4)", rating:"#5dc9e2" },
        { name: "Berry Wine", bg:"#1d1722", surface:"#29202e", text:"#f0d6e5", accent:"#c44b7a", accentH:"#e06698", border:"rgba(196,75,122,0.3)", shadow:"rgba(0,0,0,0.4)", rating:"#c44b7a" },
        { name: "Forest Canopy", bg:"#181d16", surface:"#222b20", text:"#d9efcc", accent:"#7cb342", accentH:"#9ccc65", border:"rgba(124,179,66,0.25)", shadow:"rgba(0,0,0,0.5)", rating:"#7cb342" },
        { name: "Slate Violet", bg:"#1b1e26", surface:"#252936", text:"#cfd6f0", accent:"#7182cc", accentH:"#95a5e0", border:"rgba(113,130,204,0.3)", shadow:"rgba(0,0,0,0.4)", rating:"#7182cc" },
        { name: "Peach Velvet", bg:"#1e1a18", surface:"#2c2420", text:"#f5dfcf", accent:"#e09b7a", accentH:"#f5b79a", border:"rgba(224,155,122,0.3)", shadow:"rgba(0,0,0,0.45)", rating:"#e09b7a" },
        { name: "Teal Shadow", bg:"#171e21", surface:"#212a2e", text:"#cde6e0", accent:"#4db6ac", accentH:"#70ccc4", border:"rgba(77,182,172,0.25)", shadow:"rgba(0,0,0,0.45)", rating:"#4db6ac" },
        { name: "Crimson Silk", bg:"#1e1517", surface:"#2b1e21", text:"#f0ccd2", accent:"#c4505a", accentH:"#e06b75", border:"rgba(196,80,90,0.3)", shadow:"rgba(0,0,0,0.4)", rating:"#c4505a" },
        { name: "Moss Stone", bg:"#1a1c15", surface:"#25281f", text:"#e4efc0", accent:"#9bae5b", accentH:"#bdcb78", border:"rgba(155,174,91,0.25)", shadow:"rgba(0,0,0,0.5)", rating:"#9bae5b" },
        { name: "Skyline Blue", bg:"#171d2c", surface:"#21293d", text:"#cddef5", accent:"#5b8bd4", accentH:"#7da8f0", border:"rgba(91,139,212,0.3)", shadow:"rgba(0,0,0,0.4)", rating:"#5b8bd4" },
        { name: "Sandstone Glow", bg:"#1c1a14", surface:"#27241b", text:"#f0e5cc", accent:"#d4a344", accentH:"#efc06a", border:"rgba(212,163,68,0.3)", shadow:"rgba(0,0,0,0.5)", rating:"#d4a344" },
        { name: "Plum Velour", bg:"#1d1820", surface:"#29202e", text:"#e9d4f0", accent:"#9c50b5", accentH:"#c070d8", border:"rgba(156,80,181,0.3)", shadow:"rgba(0,0,0,0.4)", rating:"#9c50b5" },
        { name: "Seafoam Dream", bg:"#1a2020", surface:"#242d2d", text:"#d0f0e8", accent:"#60bf9e", accentH:"#88e0c2", border:"rgba(96,191,158,0.25)", shadow:"rgba(0,0,0,0.4)", rating:"#60bf9e" },
        { name: "Rustic Bronze", bg:"#1c1713", surface:"#29231d", text:"#f0d7ba", accent:"#bb7843", accentH:"#dd965a", border:"rgba(187,120,67,0.3)", shadow:"rgba(0,0,0,0.5)", rating:"#bb7843" },
        { name: "Indigo Night", bg:"#181829", surface:"#232338", text:"#cfd6f5", accent:"#5b67c8", accentH:"#808de0", border:"rgba(91,103,200,0.3)", shadow:"rgba(0,0,0,0.4)", rating:"#5b67c8" },
        { name: "Honey Amber", bg:"#1e1a10", surface:"#2c2619", text:"#f5e6c2", accent:"#e0ac3a", accentH:"#f5c760", border:"rgba(224,172,58,0.35)", shadow:"rgba(0,0,0,0.5)", rating:"#e0ac3a" }
    ];

    this.setTheme = (index) => {
        let palette = (typeof index === 'number') ? palettes[index] : palettes.find(p => p.name === index);
        if (!palette) palette = palettes[0];
        const root = document.documentElement;
        root.style.setProperty('--vasara-bg', palette.bg);
        root.style.setProperty('--vasara-surface', palette.surface);
        root.style.setProperty('--vasara-text', palette.text);
        root.style.setProperty('--vasara-text-secondary', palette.text + '99');
        root.style.setProperty('--vasara-accent', palette.accent);
        root.style.setProperty('--vasara-accent-hover', palette.accentH);
        root.style.setProperty('--vasara-border', palette.border);
        root.style.setProperty('--vasara-shadow', palette.shadow);
        root.style.setProperty('--vasara-rating', palette.rating);
    };

    this.getThemes = () => palettes.map(p => p.name);

    document.addEventListener('mousemove', (event) => { mousePosition.x = event.clientX; mousePosition.y = event.clientY; });
    document.addEventListener('mousedown', (event) => { mouseButtons.set(event.button, true); });
    document.addEventListener('mouseup', (event) => { mouseButtons.set(event.button, false); });

    const keyboardKeys = new Map();
    const globalKeybindings = new Map();

    this.registerKeybinding = (keyCombo, func) => {
        keyCombo = keyCombo.split('+').sort().join('+').toLowerCase();
        if (!globalKeybindings.has(keyCombo)) globalKeybindings.set(keyCombo, []);
        globalKeybindings.get(keyCombo).push(func);
    }

    document.addEventListener('keydown', (event) => {
        keyboardKeys.set(event.key.toLowerCase(), true);
        const keyCombo = [...keyboardKeys.keys()].sort().join('+').toLowerCase();
        const funcs = globalKeybindings.get(keyCombo) || [];
        for (const key of Object.keys(config)) {
            if (config[key].type === 'hotkey' && config[key].value.toLowerCase() === keyCombo) {
                funcs.push(config[key].action);
            }
        }
        if (funcs?.length) funcs.forEach(f => f(event));
    });

    this.deregisterKeybinding = (keyCombo, func) => {
        keyCombo = keyCombo.split('+').sort().join('+').toLowerCase();
        if (!globalKeybindings.has(keyCombo)) return;
        const funcs = globalKeybindings.get(keyCombo);
        if (funcs.length === 1) globalKeybindings.delete(keyCombo);
        else {
            const index = funcs.indexOf(func);
            if (index !== -1) funcs.splice(index, 1);
        }
    }

    document.addEventListener('keyup', (event) => { keyboardKeys.delete(event.key.toLowerCase()); });
    window.addEventListener('blur', () => { keyboardKeys.clear(); });

    const settings = { persistenceEnabled: false };
    const persistentStateStorageKey = 'vasara-storedpersistentstate';
    const configLocalStorageKey = 'vasara-storedconfig';
    const config = {};

    const savePersistentState = () => {
        const state = [];
        pruneModals();
        for (let modal of modals) {
            state.push({
                title: modal.options.title,
                content: modal.content.innerHTML,
                width: parseFloat(modal.style.width),
                height: parseFloat(modal.style.height),
                top: parseFloat(modal.style.top),
                left: parseFloat(modal.style.left),
                resizable: modal.options.resizable,
                disableTitleStacking: modal.options.disableTitleStacking,
                enableGhostButton: modal.options.enableGhostButton,
                enableCloseButton: modal.options.enableCloseButton,
                unique: modal.options.unique,
                tag: modal.options.tag,
                id: modal.options.id,
                isVasaraConfig: modal.isVasaraConfig,
            });
        }
        localStorage.setItem(persistentStateStorageKey, JSON.stringify(state));
        this.saveConfig();
    }

    this.loadPersistentState = () => {
        settings.persistenceEnabled = true;
        const stateStr = localStorage.getItem(persistentStateStorageKey);
        this.loadConfig();
        if (!stateStr) return;
        const state = JSON.parse(stateStr);
        for (const options of state) {
            if (options.isVasaraConfig) this.generateConfigWindow(options);
            else this.generateModalWindow(options);
        }
    }

    window.addEventListener('beforeunload', savePersistentState);

    const validateConfigValue = (type, value) => {
        switch (type) {
            case 'checkbox': return typeof value === 'boolean';
            case 'color': return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
            case 'number': return !isNaN(value);
            default: return true;
        }
    }

    this.queryConfigKey = (key) => config[key] ? config[key].value : null;

    this.setConfigValue = (key, value, triggerCallback = true, triggerSave = false) => {
        if (!config[key]) return;
        if (!validateConfigValue(config[key].type, value)) return;
        config[key].value = value;
        if (triggerCallback && typeof config[key].callback === 'function') config[key].callback(value);
        if (triggerSave) this.saveConfig();
    }

    this.saveConfig = () => {
        const obj = {};
        for (const key of Object.keys(config)) obj[key] = String(config[key].value);
        window.localStorage.setItem(configLocalStorageKey, JSON.stringify(obj));
    }

    this.loadConfig = () => {
        const str = window.localStorage.getItem(configLocalStorageKey);
        if (!str) return;
        const object = JSON.parse(str);
        for (const key of Object.keys(object)) {
            if (typeof config[key] !== 'object') continue;
            const value = object[key];
            switch (config[key].type) {
                case 'checkbox': this.setConfigValue(key, value === 'true', false); break;
                case 'number': this.setConfigValue(key, parseFloat(value), false); break;
                default: this.setConfigValue(key, value, false); break;
            }
        }
        updateConfigElements();
    }

    this.registerConfigValue = (opts) => {
        if (config[opts.key]) return;
        config[opts.key] = opts;
    }

    this.createElem = (type, className = '', title, parent) => {
        const elem = document.createElement(type);
        elem.className = className.split(' ').map(hcn).join(' ');
        if (title) elem.title = title;
        parent?.appendChild(elem);
        return elem;
    }

    let modals = [];
    const pruneModals = () => { modals = modals.filter(e => e.isConnected); }

    this.generateModalWindow = (opts = {}) => {
        const { title = 'Modal Window', content = '', width = 430, height = 550, top = null, left = null, unique = false, id = '', tag = '', enableGhostButton = true, enableCloseButton = true, resizable = true } = opts;
        if (unique) {
            const existing = document.getElementById(id) || (tag ? document.querySelector(`[tag="${tag}"]`) : null);
            if (existing) return null;
        }

        const modal = this.createElem('div', 'modal-window', '', document.body);
        modal.id = id;
        modal.options = opts;
        modals.push(modal);

        const header = this.createElem('div', 'modal-window-header', '', modal);
        const titleElem = this.createElem('div', 'modal-window-header-title', '', header);
        const buttons = this.createElem('div', 'modal-window-header-buttons', '', header);

        const bringToFront = () => {
            pruneModals();
            modals.forEach(m => m.style.zIndex = 10000);
            modal.style.zIndex = 10001;
        }
        modal.addEventListener('mousedown', bringToFront);

        // DRAG LOGIC
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0, dragging = false;
        let dragReq = null;
        const updateDrag = () => {
            if (!dragging) return;
            modal.style.top = `${modal.offsetTop - y1}px`;
            modal.style.left = `${modal.offsetLeft - x1}px`;
            modal.style.transform = 'none';
            dragReq = requestAnimationFrame(updateDrag);
        };
        header.addEventListener('mousedown', e => {
            if (e.target.closest('.' + hcn('modal-window-header-button'))) return;
            x2 = e.clientX; y2 = e.clientY;
            dragging = true;
            dragReq = requestAnimationFrame(updateDrag);
            bringToFront();
        });
        document.addEventListener('mouseup', () => { dragging = false; cancelAnimationFrame(dragReq); });
        document.addEventListener('mousemove', e => {
            if (dragging) {
                x1 = x2 - e.clientX; y1 = y2 - e.clientY;
                x2 = e.clientX; y2 = e.clientY;
            }
        });

        titleElem.innerText = title;

        const minimizeBtn = this.createElem('div', 'modal-window-header-button minimize-button', 'Minimize', buttons);
        minimizeBtn.innerText = '−';
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.style.display = 'none';
            const icon = this.createElem('div', 'modal-window-minimized-icon', 'Restore ' + title, document.body);
            icon.innerText = title[0].toUpperCase();
            icon.addEventListener('click', () => {
                modal.style.display = 'flex';
                icon.remove();
                bringToFront();
            });
        });

        if (enableGhostButton) this.createElem('div', 'modal-window-header-button ghost-button', 'Shimmer', buttons).addEventListener('click', () => modal.classList.toggle(hcn('ghosted')));
        if (enableCloseButton) this.createElem('div', 'modal-window-header-button close-button', 'Close', buttons).addEventListener('click', e => { e.stopPropagation(); modal.remove(); });

        const contentElem = this.createElem('div', 'modal-window-content', '', modal);
        if (content) contentElem.innerHTML = content;
        modal.content = contentElem;

        // RESIZE LOGIC
        if (resizable) {
            const handle = this.createElem('div', 'resize-handle', '', modal);
            let rx1 = 0, ry1 = 0, rx2 = 0, ry2 = 0, resizing = false;
            let resizeReq = null;
            const updateResize = () => {
                if (!resizing) return;
                modal.style.width = `${modal.offsetWidth - rx1}px`;
                modal.style.height = `${modal.offsetHeight - ry1}px`;
                resizeReq = requestAnimationFrame(updateResize);
            };
            handle.addEventListener('mousedown', e => {
                e.stopPropagation();
                rx2 = e.clientX; ry2 = e.clientY;
                resizing = true;
                resizeReq = requestAnimationFrame(updateResize);
            });
            document.addEventListener('mouseup', () => { resizing = false; cancelAnimationFrame(resizeReq); });
            document.addEventListener('mousemove', e => {
                if (resizing) {
                    rx1 = rx2 - e.clientX; ry1 = ry2 - e.clientY;
                    rx2 = e.clientX; ry2 = e.clientY;
                }
            });
        }

        Object.assign(modal.style, { width: `${width}px`, height: `${height}px` });
        if (top !== null) modal.style.top = `${top}px`;
        if (left !== null) modal.style.left = `${left}px`;
        if (tag) modal.setAttribute('tag', tag);

        modal.generateLabel = (o) => {
            const l = document.createElement('label');
            l.textContent = o.text; l.title = o.tooltip; l.htmlFor = o.htmlfor;
            contentElem.appendChild(l); return modal;
        }

        modal.generateToggleInput = (o) => {
            const w = document.createElement('label'); w.className = hcn('toggle-wrap');
            const i = document.createElement('input'); i.type = 'checkbox'; i.id = o.id; i.checked = o.value; i.className = hcn('toggle-input');
            i.setAttribute('tag', 'vasara-config-element'); i.addEventListener('change', o.callback);
            const s = document.createElement('span'); s.className = hcn('toggle-switch');
            w.appendChild(i); w.appendChild(s); contentElem.appendChild(w); return modal;
        }

        modal.generateCheckboxInput = (o) => modal.generateToggleInput(o);

        modal.generateNumberInput = (o) => {
            const i = document.createElement('input'); i.type = 'number'; i.id = o.id; i.value = o.value;
            if (o.step) i.step = o.step; if (o.max) i.max = o.max; if (o.min) i.min = o.min;
            i.setAttribute('tag', 'vasara-config-element'); i.addEventListener('change', o.callback);
            contentElem.appendChild(i); return modal;
        }

        modal.generateDropdownInput = (o) => {
            const s = document.createElement('select'); s.id = o.id;
            o.options.forEach(opt => { const e = document.createElement('option'); e.value = opt; e.innerText = opt; s.appendChild(e); });
            s.value = o.value; s.setAttribute('tag', 'vasara-config-element'); s.addEventListener('change', o.callback);
            contentElem.appendChild(s); return modal;
        }

        modal.generateColorInput = (o) => {
            const i = document.createElement('input'); i.type = 'color'; i.id = o.id; i.value = o.value;
            i.setAttribute('tag', 'vasara-config-element'); i.addEventListener('change', o.callback);
            contentElem.appendChild(i); return modal;
        }

        modal.generateHotkeyInput = (o) => {
            const i = document.createElement('input'); i.id = o.id; i.type = 'text'; i.value = o.value; i.readOnly = true;
            i.setAttribute('tag', 'vasara-config-element');
            i.addEventListener('focus', () => {
                const h = (e) => {
                    if (['Control', 'Shift', 'Alt'].includes(e.key)) return;
                    e.preventDefault();
                    const c = (e.ctrlKey ? 'Ctrl+' : '') + (e.shiftKey ? 'Shift+' : '') + (e.altKey ? 'Alt+' : '') + e.key.toUpperCase();
                    i.value = c; o.callback(c); i.blur(); document.removeEventListener('keydown', h);
                };
                document.addEventListener('keydown', h);
            });
            contentElem.appendChild(i); return modal;
        }

        modal.generateStringInput = (o) => {
            const i = document.createElement('input'); i.type = 'text'; i.id = o.id; i.value = o.value;
            i.setAttribute('tag', 'vasara-config-element'); i.addEventListener('change', o.callback);
            contentElem.appendChild(i); return modal;
        }

        modal.generateButton = (o) => {
            const b = document.createElement('button'); b.textContent = o.text;
            b.addEventListener('click', o.callback); contentElem.appendChild(b); return modal;
        }

        modal.putNewline = () => { contentElem.appendChild(document.createElement('br')); return modal; }

        return modal;
    }

    const updateConfigElements = () => {
        const elements = document.querySelectorAll('[tag=vasara-config-element]');
        for (const e of elements) {
            const cfg = config[e.id];
            if (!cfg) continue;
            if (cfg.type === 'checkbox') e.checked = cfg.value;
            else e.value = cfg.value;
            if (typeof cfg.showOnlyIf === 'function') {
                const item = e.closest('.' + hcn('config-item'));
                if (item) item.style.display = cfg.showOnlyIf() ? 'flex' : 'none';
            }
        }
    }

    this.generateConfigWindow = (opts = {}) => {
        const modal = this.generateModalWindow({ title: opts.title || 'Config Window', width: opts.width || 430, height: opts.height || 650, unique: true, id: 'vasara-config-window', resizable: true });
        if (!modal) return;
        for (const key of Object.keys(config)) {
            const cfg = config[key]; if (cfg.type === 'hidden') continue;
            const item = this.createElem('div', 'config-item', '', modal.content);
            const labelCol = this.createElem('div', 'config-label-col', '', item);
            const inputCol = this.createElem('div', 'config-input-col', '', item);
            const oldContent = modal.content;
            modal.content = labelCol;
            modal.generateLabel({ text: cfg.display, tooltip: cfg.description, htmlfor: key });
            modal.content = inputCol;
            const cb = e => this.setConfigValue(key, cfg.type === 'checkbox' ? e.target.checked : e.target.value);
            switch (cfg.type) {
                case 'checkbox': modal.generateToggleInput({ value: cfg.value, callback: cb, id: key }); break;
                case 'color': modal.generateColorInput({ value: cfg.value, callback: cb, id: key }); break;
                case 'hotkey': modal.generateHotkeyInput({ value: cfg.value, callback: v => this.setConfigValue(key, v), id: key }); break;
                case 'number': modal.generateNumberInput({ value: cfg.value, step: cfg.step, min: cfg.min, max: cfg.max, callback: cb, id: key }); break;
                case 'dropdown': modal.generateDropdownInput({ value: cfg.value, options: cfg.options, callback: cb, id: key }); break;
                case 'text': modal.generateStringInput({ value: cfg.value, callback: cb, id: key }); break;
            }
            modal.content = oldContent;
        }
        this.setTheme(this.queryConfigKey('chesshook_ui_theme') || 0);
        modal.isVasaraConfig = true;
        return modal;
    }

    const hcn = className => 'vasara-' + className.split('').reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0).toString(36);
    const injectCss = (css) => {
        const hashedCSS = css.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g, (_, className) => `.${hcn(className)}`).replace(/\n/g, '');
        const styleSheetElem = document.createElement('style');
        styleSheetElem.appendChild(document.createTextNode(hashedCSS));
        document.head.appendChild(styleSheetElem);
    }

    const css = `
.modal-window * {
    transition: color 0.1s, background 0.1s, border-color 0.1s, box-shadow 0.1s, transform 0.1s;
    box-sizing: border-box;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.modal-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--vasara-bg);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid var(--vasara-border);
    border-radius: 20px;
    box-shadow: 0 25px 60px var(--vasara-shadow);
    color: var(--vasara-text);
    z-index: 10000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    will-change: transform, top, left, width, height;
}
.modal-window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--vasara-surface);
    padding: 14px 20px;
    border-bottom: 1px solid var(--vasara-border);
    cursor: move;
    user-select: none;
}
.modal-window-header-title {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}
.modal-window-header-buttons { display: flex; gap: 10px; }
.modal-window-header-button {
    width: 24px;
    height: 24px;
    border-radius: 9px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
}
.modal-window-header-button:hover { background: rgba(255,255,255,0.15); transform: translateY(-1px); }
.modal-window-content { 
    padding: 20px; 
    overflow-y: overlay; 
    flex: 1; 
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.config-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 12px;
    margin-bottom: 4px;
    border: 1px solid transparent;
}
.config-item:hover { background: rgba(255,255,255,0.05); border-color: var(--vasara-border); }
.config-label-col { flex: 1; pointer-events: none; }
.config-label-col label {
    font-size: 11px;
    font-weight: 700;
    color: var(--vasara-text);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin: 0 !important;
}
.config-input-col { 
    flex: 0 0 auto; 
    display: flex; 
    justify-content: flex-end;
    min-width: 140px;
}
.modal-window input[type="text"], .modal-window input[type="number"], .modal-window select {
    width: 100%;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid var(--vasara-border);
    background: var(--vasara-surface);
    color: var(--vasara-text);
    font-size: 12px;
    outline: none;
}
.modal-window input:focus, .modal-window select:focus { border-color: var(--vasara-accent); box-shadow: 0 0 0 2px var(--vasara-border); }
.toggle-wrap { display: flex; align-items: center; cursor: pointer; margin: 0 !important; }
.toggle-switch {
    position: relative;
    width: 40px;
    height: 22px;
    background: rgba(255,255,255,0.1);
    border: 1px solid var(--vasara-border);
    border-radius: 20px;
}
.toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toggle-input:checked + .toggle-switch { background: var(--vasara-accent); border-color: var(--vasara-accentH); }
.toggle-input:checked + .toggle-switch::after { transform: translateX(18px); background: #fff; }
.toggle-input { display: none; }
.modal-window button {
    width: 100%;
    padding: 10px;
    border-radius: 12px;
    border: none;
    background: var(--vasara-accent);
    color: #fff;
    font-weight: 800;
    cursor: pointer;
    margin-top: 10px;
    box-shadow: 0 4px 15px var(--vasara-shadow);
}
.modal-window button:hover { background: var(--vasara-accent-hover); transform: translateY(-2px); }
.resize-handle {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    cursor: nwse-resize;
    background: linear-gradient(135deg, transparent 50%, var(--vasara-accent) 50%);
    opacity: 0.4;
    z-index: 10;
}
.resize-handle:hover { opacity: 1; }
.modal-window-minimized-icon {
    position: fixed;
    bottom: 25px;
    right: 25px;
    width: 52px;
    height: 52px;
    background: var(--vasara-accent);
    border-radius: 16px;
    box-shadow: 0 10px 30px var(--vasara-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: 900;
    cursor: pointer;
    z-index: 11000;
    transition: all 0.3s;
}
.modal-window-minimized-icon:hover { transform: scale(1.1) rotate(5deg); }
.ghosted { opacity: 0.3; pointer-events: none; }
`;
    injectCss(css);
    return this;
};
