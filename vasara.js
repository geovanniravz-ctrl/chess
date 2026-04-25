const vasara = function () {
    const mousePosition = { x: 0, y: 0 };
    const mouseButtons = new Map();

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
        const state = JSON.parse(localStorage.getItem(persistentStateStorageKey) || '[]');
        this.loadConfig();
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
            case 'checkbox': return typeof value === 'boolean';
            case 'color': return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
            case 'hotkey': return true;
            case 'number': return !isNaN(value);
            default: return true;
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
        if (triggerSave) this.saveConfig();
    }

    this.saveConfig = () => {
        const obj = {};
        for (const key of Object.keys(config)) obj[key] = config[key].value;
        window.localStorage.setItem(configLocalStorageKey, JSON.stringify(obj));
    }

    this.loadConfig = () => {
        const stored = window.localStorage.getItem(configLocalStorageKey);
        if (!stored) return;
        const obj = JSON.parse(stored);
        for (const key of Object.keys(obj)) {
            if (config[key]) this.setConfigValue(key, obj[key], true);
        }
        updateConfigElements();
    }

    this.registerConfigValue = (options) => {
        const { key, value, type } = options;
        config[key] = { ...options, value };
    }

    const hcn = className => 'vasara-' + className; 

    this.createElem = (type, className = '', title = '', parent = null) => {
        const elem = document.createElement(type);
        if (className) elem.className = className.split(' ').map(hcn).join(' ');
        if (title) elem.title = title;
        if (parent) parent.appendChild(elem);
        return elem;
    }

    let modals = [];
    const pruneModals = () => { modals = modals.filter(e => e.isConnected); }

    this.generateModalWindow = (options = {}) => {
        const { title = 'Window', width = 300, height = 400, top = 100, left = 100, unique = false } = options;
        
        if (unique) {
            const existing = document.querySelector(`[original-title="${title}"]`);
            if (existing) return null;
        }

        const modal = this.createElem('div', 'modal-window', '', document.body);
        modal.setAttribute('original-title', title);
        modal.options = options;
        modals.push(modal);

        const header = this.createElem('div', 'modal-window-header', '', modal);
        const titleElem = this.createElem('div', 'modal-window-header-title', '', header);
        titleElem.innerText = title;

        const btns = this.createElem('div', 'modal-window-header-buttons', '', header);
        const closeBtn = this.createElem('div', 'close-button', 'Close', btns);
        closeBtn.onclick = () => modal.remove();

        const contentElem = this.createElem('div', 'modal-window-content', '', modal);
        modal.content = contentElem;

        modal.style.width = width + 'px';
        modal.style.height = height + 'px';
        modal.style.top = top + 'px';
        modal.style.left = left + 'px';

        let dragging = false, offset = { x: 0, y: 0 };
        header.onmousedown = e => {
            dragging = true;
            offset = { x: e.clientX - modal.offsetLeft, y: e.clientY - modal.offsetTop };
            modals.forEach(m => m.style.zIndex = 1000);
            modal.style.zIndex = 1001;
        };
        document.addEventListener('mousemove', e => {
            if (dragging) {
                modal.style.left = (e.clientX - offset.x) + 'px';
                modal.style.top = (e.clientY - offset.y) + 'px';
            }
        });
        document.addEventListener('mouseup', () => dragging = false);

        modal.generateLabel = (opt) => {
            const l = this.createElem('label', '', '', contentElem);
            l.innerText = opt.text;
            if (opt.htmlfor) l.htmlFor = opt.htmlfor;
            return modal;
        };

        modal.generateCheckboxInput = (opt) => {
            const gate = this.createElem('label', 'toggle-switch', '', contentElem);
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = opt.value;
            input.id = opt.id;
            input.setAttribute('tag', opt.tag);
            input.onchange = opt.callback;
            const slider = this.createElem('span', 'toggle-slider', '', gate);
            gate.appendChild(input);
            gate.appendChild(slider);
            return modal;
        };

        modal.generateButton = (opt) => {
            const b = this.createElem('button', '', '', contentElem);
            b.innerText = opt.text;
            b.onclick = opt.callback;
            b.setAttribute('tag', opt.tag);
            return modal;
        };

        modal.generateDropdownInput = (opt) => {
            const s = this.createElem('select', '', '', contentElem);
            s.id = opt.id;
            opt.options.forEach(o => {
                const op = document.createElement('option');
                op.value = op.innerText = o;
                s.appendChild(op);
            });
            s.value = opt.value;
            s.onchange = opt.callback;
            return modal;
        };

        modal.generateHotkeyInput = (opt) => {
            const i = this.createElem('input', '', '', contentElem);
            i.type = 'text';
            i.value = opt.value;
            i.readOnly = true;
            i.id = opt.id;
            i.onfocus = () => {
                const handler = e => {
                    if (['Control', 'Alt', 'Shift'].includes(e.key)) return;
                    e.preventDefault();
                    const combo = (e.ctrlKey ? 'Ctrl+' : '') + (e.altKey ? 'Alt+' : '') + (e.shiftKey ? 'Shift+' : '') + e.key.toUpperCase();
                    i.value = combo;
                    opt.callback(combo);
                    i.blur();
                    document.removeEventListener('keydown', handler);
                };
                document.addEventListener('keydown', handler);
            };
            return modal;
        };

        modal.generateColorInput = (opt) => {
            const i = this.createElem('input', '', '', contentElem);
            i.type = 'color';
            i.id = opt.id;
            i.value = opt.value;
            i.onchange = opt.callback;
            return modal;
        };

        modal.generateNumberInput = (opt) => {
            const i = this.createElem('input', '', '', contentElem);
            i.type = 'number';
            i.id = opt.id;
            i.value = opt.value;
            if (opt.min !== null) i.min = opt.min;
            if (opt.max !== null) i.max = opt.max;
            if (opt.step !== null) i.step = opt.step;
            i.onchange = opt.callback;
            return modal;
        };

        modal.generateStringInput = (opt) => {
            const i = this.createElem('input', '', '', contentElem);
            i.type = 'text';
            i.id = opt.id;
            i.value = opt.value;
            i.onchange = opt.callback;
            return modal;
        };

        modal.putNewline = () => { this.createElem('br', '', '', contentElem); return modal; };
        modal.appendElement = (e) => { contentElem.appendChild(e); return modal; };

        return modal;
    }

    this.generateConfigWindow = (options = {}) => {
        const modal = this.generateModalWindow({ ...options, unique: true });
        if (!modal) return;
        for (const key of Object.keys(config)) {
            modal.generateLabel({ text: config[key].display, htmlfor: key });
            switch (config[key].type) {
                case 'checkbox': modal.generateCheckboxInput({ id: key, value: config[key].value, tag: 'vasara-config-element', callback: e => this.setConfigValue(key, e.target.checked, true, true) }); break;
                case 'dropdown': modal.generateDropdownInput({ id: key, value: config[key].value, options: config[key].options, callback: e => this.setConfigValue(key, e.target.value, true, true) }); break;
                case 'hotkey': modal.generateHotkeyInput({ id: key, value: config[key].value, callback: v => this.setConfigValue(key, v, true, true) }); break;
                case 'color': modal.generateColorInput({ id: key, value: config[key].value, callback: e => this.setConfigValue(key, e.target.value, true, true) }); break;
                case 'number': modal.generateNumberInput({ id: key, value: config[key].value, min: config[key].min, max: config[key].max, step: config[key].step, callback: e => this.setConfigValue(key, e.target.value, true, true) }); break;
                case 'text': modal.generateStringInput({ id: key, value: config[key].value, callback: e => this.setConfigValue(key, e.target.value, true, true) }); break;
            }
            modal.putNewline();
        }
        modal.isVasaraConfig = true;
        return modal;
    }

    const updateConfigElements = () => {
        document.querySelectorAll('[tag=vasara-config-element]').forEach(elem => {
            const cfg = config[elem.id];
            if (cfg.type === 'checkbox') elem.checked = cfg.value;
            else elem.value = cfg.value;
            
            if (cfg.showOnlyIf) {
                const label = document.querySelector(`label[for="${elem.id}"]`);
                const vis = cfg.showOnlyIf() ? 'inline-block' : 'none';
                elem.style.display = vis;
                if (label) label.style.display = vis;
                if (elem.nextElementSibling?.tagName === 'BR') elem.nextElementSibling.style.display = vis;
                if (elem.parentElement?.classList.contains(hcn('toggle-switch'))) elem.parentElement.style.display = vis;
            }
        });
    }

    const injectCss = (css) => {
        const style = document.createElement('style');
        style.innerText = css.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g, (_, c) => '.' + hcn(c));
        document.head.appendChild(style);
    }

    injectCss(`
        .modal-window {
            position: fixed;
            background: #121212 !important;
            border: 1px solid #333 !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
            z-index: 999999 !important;
            overflow: hidden;
            font-family: 'Inter', system-ui, sans-serif !important;
            display: flex;
            flex-direction: column;
        }
        .modal-window-header {
            background: #000 !important;
            padding: 10px 15px !important;
            border-bottom: 2px solid #e91e63 !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .modal-window-header-title {
            color: #e91e63 !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .modal-window-header-buttons {
            display: flex;
            gap: 6px;
        }
        .close-button {
            width: 10px;
            height: 10px;
            background: #ff5252;
            border-radius: 50%;
            cursor: pointer;
        }
        .modal-window-content {
            padding: 15px !important;
            flex: 1;
            overflow-y: auto;
            background: #121212 !important;
        }
        .modal-window-content label {
            color: #aaa !important;
            font-size: 11px !important;
            display: inline-block;
            min-width: 130px;
            margin-bottom: 10px;
        }
        .modal-window-content input, .modal-window-content select, .modal-window-content button {
            background: #1e1e1e !important;
            border: 1px solid #333 !important;
            border-radius: 6px !important;
            color: #fff !important;
            padding: 5px 8px !important;
            font-size: 11px !important;
            outline: none;
            transition: 0.2s;
        }
        .modal-window-content button {
            width: 100%;
            border-color: #e91e63 !important;
            color: #e91e63 !important;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            margin-bottom: 5px;
        }
        .modal-window-content button:hover {
            background: #e91e63 !important;
            color: #fff !important;
            box-shadow: 0 0 10px rgba(233,30,99,0.5);
        }
        .toggle-switch {
            width: 34px !important;
            height: 18px !important;
            background: #333 !important;
            border-radius: 20px !important;
            position: relative;
            display: inline-block !important;
            cursor: pointer;
            min-width: unset !important;
        }
        .toggle-switch input {
            opacity: 0; width: 0; height: 0; position: absolute;
        }
        .toggle-slider {
            position: absolute; top: 3px; left: 3px; width: 12px; height: 12px;
            background: #fff; border-radius: 50%; transition: 0.3s;
        }
        .toggle-switch input:checked + .toggle-slider {
            left: 19px; background: #e91e63; box-shadow: 0 0 8px #e91e63;
        }
    `);

    return this;
};
