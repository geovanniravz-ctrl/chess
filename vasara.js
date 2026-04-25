const vasara = function () {
    const mousePosition = { x: 0, y: 0 };
    const mouseButtons = new Map();

    const palettes = [
        { name: "Golden Night", bg:"#1e1e24", surface:"#2a2a30", text:"#f0e6d2", accent:"#f5c518", accentH:"#ffdd57", border:"rgba(255,215,0,0.2)", shadow:"rgba(0,0,0,0.4)", rating:"#f5c518" },
        { name: "Rose Twilight", bg:"#1e1b1e", surface:"#2b2329", text:"#f0dce0", accent:"#d88c9a", accentH:"#f0a6b3", border:"rgba(216,140,154,0.25)", shadow:"rgba(0,0,0,0.35)", rating:"#d88c9a" },
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

    /**
     * @description Set the UI theme
     * @param {number|string} index Index or name of the palette
     */
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

    /**
     * @description Get all available theme names
     * @returns {string[]}
     */
    this.getThemes = () => palettes.map(p => p.name);

    document.addEventListener('mousemove', (event) => {
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
    });

    document.addEventListener('mousedown', (event) => {
        mouseButtons.set(event.button, true);
    });

    document.addEventListener('mouseup', (event) => {
        mouseButtons.set(event.button, false);
    });

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
            if (index === -1) return;
            funcs.splice(index, 1);
        }
    }

    document.addEventListener('keyup', (event) => {
        keyboardKeys.delete(event.key.toLowerCase());
    });

    window.addEventListener('blur', () => {
        keyboardKeys.clear();
    });

    const settings = {
        persistenceEnabled: false,
    }
    const persistentStateStorageKey = 'vasara-storedpersistentstate';
    const savePersistentState = () => {
        const state = [];
        pruneModals();
        for (let modal of modals) {
            state.push({
                title: modal.options.title,
                content: modal.content.outerHTML,
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
            if (options.isVasaraConfig) {
                this.generateConfigWindow(options);
            } else {
                this.generateModalWindow(options);
            }
        }
    }

    window.addEventListener('beforeunload', e => {
        savePersistentState();
    });

    const config = {};
    const configLocalStorageKey = 'vasara-storedconfig';

    const validateConfigValue = (type, value) => {
        switch (type) {
            case 'checkbox':
                return typeof value === 'boolean';
            case 'color':
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
            case 'hotkey':
                return true;
            case 'number':
                return !isNaN(value);
            default:
                return true;
        }
    }

    this.queryConfigKey = (key) => {
        if (!config[key]) return null;
        return config[key].value;
    }

    this.setConfigValue = (key, value, triggerCallback = true, triggerSave = false) => {
        if (!config[key]) return;
        if (!validateConfigValue(config[key].type, value)) return;
        config[key].value = value;
        if (triggerCallback && typeof config[key].callback === 'function') {
            config[key].callback(value);
        }
        if (triggerSave) {
            this.saveConfig();
        }
    }

    const serializeConfig = (pretty = false) => {
        const object = {};
        for (const key of Object.keys(config)) {
            object[key] = String(config[key].value);
        }
        return JSON.stringify(object, null, pretty ? 4 : null);
    }

    this.saveConfig = () => {
        window.localStorage.setItem(configLocalStorageKey, serializeConfig());
    }

    const deserializeConfig = (str, triggerCallbacks = false) => {
        if (!str) return;
        const object = JSON.parse(str);
        if (!object) return;
        for (const key of Object.keys(object)) {
            if (typeof config[key] !== "object") continue;
            const value = object[key];
            switch (config[key].type) {
                case 'checkbox':
                    if (value === 'false') this.setConfigValue(key, false, triggerCallbacks);
                    else if (value === 'true') this.setConfigValue(key, true, triggerCallbacks);
                    break;
                case 'color':
                case 'hotkey':
                case 'dropdown':
                case 'text':
                case 'hidden':
                    this.setConfigValue(key, value, triggerCallbacks);
                    break;
                case 'number':
                    this.setConfigValue(key, parseFloat(value), triggerCallbacks);
                    break;
            }
        }
    }

    this.loadConfig = () => {
        deserializeConfig(window.localStorage.getItem(configLocalStorageKey));
        updateConfigElements();
    }

    this.registerConfigValue = ({
        key,
        value,
        display = 'Config Value',
        description = 'A configuration value',
        type, 
        callback = null,
        showOnlyIf = null,
        action = null, 
        options = [], 
        min = null, 
        max = null, 
        step = null, 
    } = {}) => {
        if (config[key]) return;
        const configValue = { key, display, description, type, value };
        if (type === 'hotkey') Object.assign(configValue, { action });
        if (type === 'number') Object.assign(configValue, { min, max, step });
        if (type === 'dropdown') {
            const opts = [value];
            options.forEach(o => { if(!opts.includes(o)) opts.push(o); });
            Object.assign(configValue, { options: opts });
        }
        Object.assign(configValue, { showOnlyIf, callback });
        config[key] = configValue;
    }

    this.createElem = (type, className = '', title, parent) => {
        const elem = document.createElement(type);
        elem.className = className.split(' ').map(hcn).join(' ');
        if (title) elem.title = title;
        parent?.appendChild(elem);
        return elem;
    }

    const titleDuplicateCounts = {};
    let modals = [];
    const pruneModals = () => {
        modals = modals.filter(e => e.isConnected);
    }

    this.generateModalWindow = ({
        title = 'Modal Window',
        content = '',
        width = 400,
        height = 300,
        top = null,
        left = null,
        resizable = false,
        disableTitleStacking = false,
        enableGhostButton = true,
        enableCloseButton = true,
        unique = false,
        tag = '',
        id = '',
    } = {}) => {
        if (unique) {
            const existing = document.getElementById(id) || (tag ? document.querySelector(`[tag="${tag}"]`) : null);
            if (existing) return null;
        }

        const modal = this.createElem('div', 'modal-window', '', document.body);
        modal.id = id;
        modal.options = { title, content, width, height, top, left, resizable, disableTitleStacking, enableGhostButton, enableCloseButton, unique, tag, id };
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

        let x1 = 0, y1 = 0, x2 = 0, y2 = 0, dragging = false;
        header.addEventListener('mousedown', e => {
            if (e.target.closest('.' + hcn('modal-window-header-button'))) return;
            [x2, y2, dragging] = [e.clientX, e.clientY, true];
            bringToFront();
        });
        document.addEventListener('mouseup', () => { dragging = false; });
        document.addEventListener('mousemove', e => {
            if (dragging) {
                [x1, y1] = [x2 - e.clientX, y2 - e.clientY];
                [x2, y2] = [e.clientX, e.clientY];
                modal.style.top = `${modal.offsetTop - y1}px`;
                modal.style.left = `${modal.offsetLeft - x1}px`;
                modal.style.transform = 'none';
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
        if (enableCloseButton) this.createElem('div', 'modal-window-header-button close-button', 'Close', buttons).addEventListener('click', e => {
            e.stopPropagation();
            modal.remove();
        });

        const contentElem = this.createElem('div', 'modal-window-content', '', modal);
        if (content) contentElem.innerHTML = content;
        modal.content = contentElem;

        Object.assign(modal.style, { width: `${width}px`, height: `${height}px` });
        if (top !== null) modal.style.top = `${top}px`;
        if (left !== null) modal.style.left = `${left}px`;
        if (tag) modal.setAttribute('tag', tag);

        modal.generateLabel = function ({ text = '', tooltip = '', htmlfor = '' } = {}) {
            const label = document.createElement('label');
            label.textContent = text;
            label.title = tooltip;
            label.htmlFor = htmlfor;
            contentElem.appendChild(label);
            return modal;
        }

        modal.generateToggleInput = function ({ id = '', value = false, callback = null } = {}) {
            const wrap = document.createElement('label');
            wrap.className = hcn('toggle-wrap');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = id;
            input.checked = value;
            input.className = hcn('toggle-input');
            input.setAttribute('tag', 'vasara-config-element');
            input.addEventListener('change', callback);
            const slider = document.createElement('span');
            slider.className = hcn('toggle-switch');
            wrap.appendChild(input);
            wrap.appendChild(slider);
            contentElem.appendChild(wrap);
            return modal;
        }

        modal.generateCheckboxInput = function (opts) { return modal.generateToggleInput(opts); }

        modal.generateNumberInput = function ({ id = '', value = 0, step, max, min, callback } = {}) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = id;
            input.value = value;
            if (step) input.step = step;
            if (max) input.max = max;
            if (min) input.min = min;
            input.setAttribute('tag', 'vasara-config-element');
            input.addEventListener('change', callback);
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateDropdownInput = function ({ id = '', value = '', options = [], callback } = {}) {
            const select = document.createElement('select');
            select.id = id;
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.innerText = opt;
                select.appendChild(o);
            });
            select.value = value;
            select.setAttribute('tag', 'vasara-config-element');
            select.addEventListener('change', callback);
            contentElem.appendChild(select);
            return modal;
        }

        modal.generateColorInput = function ({ id = '', value = '', callback } = {}) {
            const input = document.createElement('input');
            input.type = 'color';
            input.id = id;
            input.value = value;
            input.setAttribute('tag', 'vasara-config-element');
            input.addEventListener('change', callback);
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateHotkeyInput = function ({ id = '', value = '', callback } = {}) {
            const input = document.createElement('input');
            input.id = id;
            input.type = 'text';
            input.value = value;
            input.readOnly = true;
            input.setAttribute('tag', 'vasara-config-element');
            input.addEventListener('focus', () => {
                const onKeydown = (e) => {
                    if (['Control', 'Shift', 'Alt'].includes(e.key)) return;
                    e.preventDefault();
                    const combo = (e.ctrlKey ? 'Ctrl+' : '') + (e.shiftKey ? 'Shift+' : '') + (e.altKey ? 'Alt+' : '') + e.key.toUpperCase();
                    input.value = combo;
                    callback(combo);
                    input.blur();
                    document.removeEventListener('keydown', onKeydown);
                };
                document.addEventListener('keydown', onKeydown);
            });
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateStringInput = function ({ id = '', value = '', callback } = {}) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = id;
            input.value = value;
            input.setAttribute('tag', 'vasara-config-element');
            input.addEventListener('change', callback);
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateButton = function ({ text = '', callback } = {}) {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', callback);
            contentElem.appendChild(button);
            return modal;
        }

        modal.putNewline = function () {
            contentElem.appendChild(document.createElement('br'));
            return modal;
        }

        return modal;
    }

    const updateConfigElements = () => {
        const configElements = document.querySelectorAll('[tag=vasara-config-element]');
        for (const elem of configElements) {
            const cfg = config[elem.id];
            if (!cfg) continue;
            if (cfg.type === 'checkbox') elem.checked = cfg.value;
            else elem.value = cfg.value;
            if (typeof cfg.showOnlyIf === 'function') {
                const label = document.querySelector(`label[for="${elem.id}"]`);
                const display = cfg.showOnlyIf() ? 'block' : 'none';
                elem.style.display = display;
                if (label) label.style.display = display;
            }
        }
    }

    this.generateConfigWindow = ({ title = 'Config Window', width = 450, height = 500 } = {}) => {
        const modal = this.generateModalWindow({ title, width, height, unique: true, id: 'vasara-config-window' });
        if (!modal) return;
        for (const key of Object.keys(config)) {
            const cfg = config[key];
            if (cfg.type === 'hidden') continue;
            modal.generateLabel({ text: cfg.display, tooltip: cfg.description, htmlfor: key });
            switch (cfg.type) {
                case 'checkbox': modal.generateToggleInput({ value: cfg.value, callback: e => this.setConfigValue(key, e.target.checked), id: key }); break;
                case 'color': modal.generateColorInput({ value: cfg.value, callback: e => this.setConfigValue(key, e.target.value), id: key }); break;
                case 'hotkey': modal.generateHotkeyInput({ value: cfg.value, callback: v => this.setConfigValue(key, v), id: key }); break;
                case 'number': modal.generateNumberInput({ value: cfg.value, step: cfg.step, min: cfg.min, max: cfg.max, callback: e => this.setConfigValue(key, e.target.value), id: key }); break;
                case 'dropdown': modal.generateDropdownInput({ value: cfg.value, options: cfg.options, callback: e => this.setConfigValue(key, e.target.value), id: key }); break;
                case 'text': modal.generateStringInput({ value: cfg.value, callback: e => this.setConfigValue(key, e.target.value), id: key }); break;
            }
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
    transition: color 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.modal-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--vasara-bg);
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    border: 1px solid var(--vasara-border);
    border-radius: 20px;
    box-shadow: 0 20px 50px var(--vasara-shadow);
    color: var(--vasara-text);
    z-index: 10000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.modal-window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--vasara-surface);
    padding: 12px 18px;
    border-bottom: 1px solid var(--vasara-border);
    cursor: move;
}
.modal-window-header-title {
    flex: 1;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.5px;
}
.modal-window-header-buttons { display: flex; gap: 8px; }
.modal-window-header-button {
    width: 22px;
    height: 22px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    opacity: 0.6;
}
.modal-window-header-button:hover { opacity: 1; background: rgba(255,255,255,0.1); }
.modal-window-content { padding: 18px; overflow-y: auto; flex: 1; }
.modal-window-content label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    margin: 10px 0 5px 0;
    color: var(--vasara-text-secondary);
    text-transform: uppercase;
}
.modal-window input[type="text"], .modal-window input[type="number"], .modal-window select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid var(--vasara-border);
    background: var(--vasara-surface);
    color: var(--vasara-text);
    font-size: 14px;
    outline: none;
    margin-bottom: 5px;
}
.modal-window input:focus, .modal-window select:focus { border-color: var(--vasara-accent); }
.toggle-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; cursor: pointer; }
.toggle-switch {
    position: relative;
    width: 42px;
    height: 22px;
    background: var(--vasara-border);
    border-radius: 22px;
}
.toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
}
.toggle-input:checked + .toggle-switch { background: var(--vasara-accent); box-shadow: 0 0 10px var(--vasara-accent); }
.toggle-input:checked + .toggle-switch::after { transform: translateX(20px); }
.toggle-input { display: none; }
.modal-window button {
    width: 100%;
    padding: 12px;
    border-radius: 14px;
    border: none;
    background: var(--vasara-accent);
    color: #fff;
    font-weight: 800;
    cursor: pointer;
    margin-top: 10px;
}
.modal-window-minimized-icon {
    position: fixed;
    bottom: 25px;
    right: 25px;
    width: 50px;
    height: 50px;
    background: var(--vasara-accent);
    border-radius: 50%;
    box-shadow: 0 10px 30px var(--vasara-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 22px;
    font-weight: 800;
    cursor: pointer;
    z-index: 11000;
}
.ghosted { opacity: 0.3; }
`;
    injectCss(css);
    return this;
};
