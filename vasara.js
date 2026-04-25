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

    /**
     * @description Registers a keybinding
     * @param {string} keyCombo The key combination to bind to
     * @param {(event: KeyboardEvent) => void} func The function to call when the key combination is pressed
     */
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

    /**
     * @description Deregisters a keybinding
     * @param {string} keyCombo The key combination to deregister
     * @param {Function} func The function to deregister
     */
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

    /**
     * @description Call this on load to enable the behavior of trying to persist the state of modal windows between page loads
     */
    this.loadPersistentState = () => {
        settings.persistenceEnabled = true;

        const state = JSON.parse(localStorage.getItem(persistentStateStorageKey));

        this.loadConfig();

        if (!state);

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
                return /^(?:Ctrl|Alt|Shift|Meta|\b[a-zA-Z]\b)(?:\+(?:Ctrl|Alt|Shift|Meta|\b[a-zA-Z]\b))*$/.test(value);
            case 'number':
                return !isNaN(value);
            default:
                return true;
        }
    }

    /**
     * @description Query the value of a config key
     * @param {string} key
     * @returns {any} The stored value
     */
    this.queryConfigKey = (key) => {
        if (!config[key]) return console.warn('Key does not exist!');
        return config[key].value;
    }

    /**
     * @description Set a value 
     * @param {string} key 
     * @param {string} value 
     * @param {boolean} triggerCallback 
     * @param {boolean} triggerSave 
     * @returns 
     */
    this.setConfigValue = (key, value, triggerCallback = true, triggerSave = false) => {
        if (!config[key]) return console.warn(`Tried to set the value of unregistered key ${key}`);

        if (!validateConfigValue(config[key].type, value)) return console.error(`Tried to give ${config[key].type} '${key}' an invalid value of: `, value);

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

    /**
     * @description Save the config to localStorage
     */
    this.saveConfig = () => {
        window.localStorage.setItem(configLocalStorageKey, serializeConfig());
    }

    const deserializeConfig = (str, triggerCallbacks = false) => {
        const object = JSON.parse(str);
        if (!object) return console.warn(`No object`);

        for (const key of Object.keys(object)) {
            if (typeof config[key] !== "object") {
                console.warn(`Tried to restore config key '${key}' which has not been registered.`);
                continue;
            }

            const value = object[key];
            switch (config[key].type) {
                case 'checkbox':
                    if (value === 'false') this.setConfigValue(key, false, triggerCallbacks);
                    else if (value === 'true') this.setConfigValue(key, true, triggerCallbacks);
                    else console.warn(`Tried to give checkbox '${key}' an invalid value of: `, value);
                    break;
                case 'color':
                    if (validateConfigValue('color', value)) this.setConfigValue(key, value, triggerCallbacks);
                    else console.warn(`Tried to give color '${key}' an invalid value of: `, value);
                    break;
                case 'hotkey':
                    if (validateConfigValue('hotkey', value)) this.setConfigValue(key, value, triggerCallbacks);
                    else console.warn(`Tried to give hotkey '${key}' an invalid value of: `, value);
                    break;
                case 'number':
                    if (!isNaN(value)) this.setConfigValue(key, parseFloat(value), triggerCallbacks);
                    else console.warn(`Tried to give number '${key}' a NaN value of: `, value);
                    break;
                case 'dropdown':
                case 'text':
                case 'hidden':
                    this.setConfigValue(key, value, triggerCallbacks);
                    break;
            }
        }
    }

    /**
     * @description Load the configuration localStorage
     */
    this.loadConfig = () => {
        deserializeConfig(window.localStorage.getItem(configLocalStorageKey));

        updateConfigElements();
    }

    this.registerConfigValue = ({
        key,
        value,
        display = 'Config Value',
        description = 'A configuration value',
        type, // 'checkbox', 'color', 'hotkey', 'dropdown', 'number', 'text', 'hidden'
        callback = null,
        showOnlyIf = null,
        action = null, // 'hotkey' only
        options = [], // 'dropdown' only
        min = null, // 'number' only
        max = null, // 'number' only
        step = null, // 'number' only
    } = {}) => {
        if (config[key]) return console.error(`Tried to register an existing key!`);

        const configValue = { key, display, description };

        if (!['checkbox', 'color', 'hotkey', 'dropdown', 'number', 'text', 'hidden'].includes(type)) return console.error(`Invalid type: ${type}`);

        configValue.type = type;

        if (!validateConfigValue(type, value)) return console.error(`Tried to give ${type} '${key}' an invalid value of: `, value);

        configValue.value = value;

        if (type === 'hotkey') {
            if (action === null) {
                return console.error('Must define an action for a hotkey')
            }

            Object.assign(configValue, { action });
        }

        if (type === 'number') {
            if (min === null || max === null || step === null) {
                return console.error('min, max, step must be defined when registering a number');
            }

            Object.assign(configValue, { min, max, step });
        }

        if (type === 'dropdown') {
            const opts = [value];
            opts.push(...options);
            Object.assign(configValue, { options: opts });
        }

        if (showOnlyIf !== null && typeof showOnlyIf !== 'function') return console.error('Value of showOnlyIf is not a function');
        Object.assign(configValue, { showOnlyIf });

        if (callback !== null && typeof callback !== 'function') return console.error('Value of onchange is not a functions');
        Object.assign(configValue, { callback });

        config[key] = configValue;
    }

    /**
     * @description Shorthand function for creating an element and appending it to a parent
     * @param {string} type The type of element to create 
     * @param {string} className The class name(s) to add to the element 
     * @param {string} alt The alt text for the element
     * @param {HTMLElement} parent The parent element to append the new element to 
     * @returns {HTMLElement} The newly created element
     */
    this.createElem = (type, className = '', title, parent) => {
        const elem = document.createElement(type);
        elem.className = className.split(' ').map(hcn).join(' ');
        elem.title = title;
        parent?.appendChild(elem);
        return elem;
    }

    const titleDuplicateCounts = {};
    let modals = [];
    const pruneModals = () => {
        modals = modals.filter(e => e.isConnected);
    }

    /**
     * @description Generates a modal window
     * @param {Object} options The options for the modal window
     * @returns {HTMLElement} The modal window element
     */
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
        if (!disableTitleStacking || unique) {
            const titleElements = document.querySelectorAll('.' + hcn('modal-window-header-title'));
            let matched = 0;

            for (const elem of titleElements) {
                if (elem.getAttribute('originalTitle') === title) {
                    matched++;
                }
            }

            if (matched <= 0) {
                titleDuplicateCounts[title] = 0;
            }

            titleDuplicateCounts[title]++;

            if (titleDuplicateCounts[title] > 1) {
                if (unique) {
                    return console.info(`Blocked duplicate window with title: `, title);
                }

                if (!disableTitleStacking) {
                    title += ` (${titleDuplicateCounts[title]})`;
                }
            }
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
            modals.forEach(m => m.style.zIndex = 0);
            modal.style.zIndex = 1;
        }

        modal.addEventListener('click', bringToFront);

        let x1 = 0, y1 = 0, x2 = 0, y2 = 0, dragging = false;
        header.addEventListener('mousedown', e => {
            [x2, y2, dragging] = [e.clientX, e.clientY, true];
            bringToFront();
        });
        document.addEventListener('mouseup', e => {
            dragging = e.button !== 0 ? dragging : false;
        });
        document.addEventListener('mousemove', e => {
            if (dragging) {
                [x1, y1] = [x2 - e.clientX, y2 - e.clientY];
                [x2, y2] = [e.clientX, e.clientY];
                modal.style.top = `${modal.offsetTop - y1}px`;
                modal.style.left = `${modal.offsetLeft - x1}px`;
            }
        });

        titleElem.innerText = title;
        titleElem.setAttribute('originalTitle', title);
        if (enableGhostButton) createElem('div', 'modal-window-header-button ghost-button', 'Toggle window shimmer', buttons).addEventListener('click', () => modal.classList.toggle(hcn('ghosted')));
        if (enableCloseButton) createElem('div', 'modal-window-header-button close-button', 'Close window', buttons).addEventListener('click', e => {
            e.stopPropagation();
            modal.remove()
        });
        const contentElem = this.createElem('div', 'modal-window-content', '', modal);
        if (content) contentElem.outerHTML = content;
        modal.content = contentElem;

        Object.assign(modal.style, { width: `${width}px`, height: `${height}px` });
        if (top !== null) Object.assign(modal.style, { top: `${top}px` });
        if (left !== null) Object.assign(modal.style, { left: `${left}px` });

        if (tag) modal.setAttribute('tag', tag)

        modal.generateLabel = function ({
            text = '',
            tooltip = '',
            htmlfor = '',
            tag = '',
        } = {}) {
            const label = document.createElement('label');

            label.textContent = text;
            label.title = tooltip;
            label.htmlFor = htmlfor;
            label.setAttribute('tag', tag);

            contentElem.appendChild(label);
            return modal;
        }

        modal.generateNumberInput = function ({
            id = '',
            value = 0,
            step = null,
            max = null,
            min = null,
            callback = null,
            tag = '',
        } = {}) {
            const input = document.createElement('input');

            input.type = 'number';
            input.id = id;
            input.value = value;
            if (step !== null) input.step = step;
            if (max !== null) input.max = max;
            if (min !== null) input.min = min;
            input.setAttribute('tag', tag);

            input.addEventListener('change', callback);
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateDropdownInput = function ({
            id = '',
            value = '',
            options = [],
            callback = null,
            tag = '',
        } = {}) {
            const select = document.createElement('select');
            select.id = id;

            if (options.indexOf(value) < 0) options.push(value);

            for (const opt of options) {
                const option = document.createElement('option');
                option.value = opt;
                option.innerText = opt;
                select.appendChild(option);
            }

            select.value = value;
            select.setAttribute('tag', tag);

            select.addEventListener('change', callback);
            contentElem.appendChild(select);
            return modal;
        }

        modal.generateColorInput = function ({
            id = '',
            value = '',
            callback = null,
            tag = '',
        } = {}) {
            const input = document.createElement('input');

            input.type = 'color';
            input.id = id;
            input.value = value;
            input.setAttribute('tag', tag);

            input.addEventListener('change', callback);
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateCheckboxInput = function ({
            id = '',
            value = false,
            callback = null,
            tag = '',
        } = {}) {
            const container = document.createElement('div');
            container.className = hcn('toggle-container');
            
            const button = document.createElement('button');
            button.className = hcn('toggle-button') + (value ? ' ' + hcn('active') : '');
            button.id = id;
            button.setAttribute('tag', tag);
            button.innerText = value ? 'ON' : 'OFF';

            button.style.width = '60px'; // Ensure consistent width

            button.addEventListener('click', () => {
                const newState = !button.classList.contains(hcn('active'));
                button.classList.toggle(hcn('active'), newState);
                button.innerText = newState ? 'ON' : 'OFF';
                callback({ target: { checked: newState } });
            });

            container.appendChild(button);
            contentElem.appendChild(container);
            return modal;
        }

        modal.generateHotkeyInput = function ({
            id = '',
            value = '',
            callback = null,
            tag = '',
        } = {}) {
            const input = document.createElement('input');

            input.id = id;
            input.type = 'text';
            input.className = hcn('hotkey-input');
            input.value = value;
            input.readOnly = true;
            input.addEventListener('focus', () => {
                input.value = '...';
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
            input.setAttribute('tag', tag);

            contentElem.appendChild(input);
            return modal;
        }

        modal.generateStringInput = function ({
            id = '',
            value = '',
            callback = null,
            tag = '',
        } = {}) {
            const input = document.createElement('input');

            input.type = 'text';
            input.id = id;
            input.value = value;
            input.setAttribute('tag', tag);

            input.addEventListener('change', callback);
            contentElem.appendChild(input);
            return modal;
        }

        modal.generateButton = function ({
            id = '',
            text = '',
            callback = null,
            tag = '',
        } = {}) {
            const button = document.createElement('button');

            button.id = id;
            button.textContent = text;
            button.setAttribute('tag', tag);

            button.addEventListener('click', callback);
            contentElem.appendChild(button);
            return modal;
        }

        modal.putNewline = function () {
            const newline = document.createElement('div');
            newline.style.marginBottom = '8px';
            contentElem.appendChild(newline);
            return modal;
        }

        modal.appendElement = function (element) {
            contentElem.appendChild(element);
            return modal;
        }

        return modal;
    }

    const updateConfigElements = () => {
        const configElements = document.querySelectorAll('[tag=vasara-config-element]');

        for (const elem of configElements) {
            if (config[elem.id].type === 'checkbox') {
                const isActive = config[elem.id].value;
                elem.classList.toggle(hcn('active'), isActive);
                elem.innerText = isActive ? 'ON' : 'OFF';
            } else {
                elem.value = config[elem.id].value;
            }

            if (typeof config[elem.id].showOnlyIf === 'function') {
                const label = document.querySelector(`[for=${elem.id}]`);
                if (config[elem.id].showOnlyIf()) {
                    elem.style.display = 'inline-block';
                    if (label) label.style.display = 'inline-block';
                }
                else {
                    elem.style.display = 'none';
                    if (label) label.style.display = 'none';
                }
            }
        }
    }

    /**
     * @description Shorthand to generate a modal with the contents 
     * @param {Object} options The options for the modal window
     * @returns {HTMLElement} The modal window element
     */
    this.generateConfigWindow = ({
        title = 'Config Window',
        width = 400,
        height = 300,
        top = null,
        left = null,
        resizable = false,
        disableTitleStacking = false,
        enableGhostButton = true,
        enableCloseButton = true,
        tag = '',
        id = '',
    } = {}) => {
        const modal = this.generateModalWindow({ title, width, height, top, left, resizable, disableTitleStacking, enableGhostButton, enableCloseButton, tag, id, unique: true });

        if (!modal) return;

        for (const key of Object.keys(config)) {
            const label = modal.generateLabel({
                text: config[key].display,
                tooltip: config[key].description,
                htmlfor: key,
            });
            switch (config[key].type) {
                case 'checkbox':
                    modal.generateCheckboxInput({
                        value: config[key].value,
                        callback: e => this.setConfigValue(key, e.target.checked),
                        tag: 'vasara-config-element',
                        id: key,
                    });
                    break;
                case 'color':
                    modal.generateColorInput({
                        value: config[key].value,
                        callback: e => this.setConfigValue(key, e.target.value),
                        tag: 'vasara-config-element',
                        id: key,
                    });
                    break;
                case 'hotkey':
                    modal.generateHotkeyInput({
                        value: config[key].value,
                        callback: v => this.setConfigValue(key, v),
                        tag: 'vasara-config-element',
                        id: key,
                    });
                    break;
                case 'number':
                    modal.generateNumberInput({
                        value: config[key].value,
                        step: config[key].step,
                        min: config[key].min,
                        max: config[key].max,
                        callback: e => this.setConfigValue(key, e.target.value),
                        tag: 'vasara-config-element',
                        id: key,
                    });
                    break;
                case 'dropdown':
                    modal.generateDropdownInput({
                        value: config[key].value,
                        options: config[key].options,
                        callback: e => this.setConfigValue(key, e.target.value),
                        tag: 'vasara-config-element',
                        id: key,
                    });
                    break;
                case 'text':
                    modal.generateStringInput({
                        value: config[key].value,
                        callback: e => this.setConfigValue(key, e.target.value),
                        tag: 'vasara-config-element',
                        id: key,
                    });
                    break;
            }
            modal.putNewline();
        }

        const configElements = document.querySelectorAll('[tag=vasara-config-element]');
        configElements.forEach(e => e.addEventListener('change', updateConfigElements));
        updateConfigElements();

        modal.isVasaraConfig = true;

        return modal;
    }

    const hcn = className => 'vasara-' + className.split('').reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0).toString(36);
    const injectCss = (css) => {
        const hashedCSS = css.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g, (_, className) => `.${hcn(className)}`);
        const minifiedCSS = hashedCSS.replace(/\n\s+/g, '');

        const styleSheetElem = document.createElement('style');
        styleSheetElem.appendChild(document.createTextNode(minifiedCSS));
        document.head.appendChild(styleSheetElem);
    }

    const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');

.modal-window * {
    font-family: 'Outfit', sans-serif;
    box-sizing: border-box;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    z-index: 10000;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 30, 86, 0.1);
    color: #fff;
    overflow: hidden;
    animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, -45%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
}

.modal-window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    padding: 12px 20px;
    cursor: move;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-window-header-title {
    font-weight: 600;
    font-size: 15px;
    color: #FF1E56;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.modal-window-header-buttons {
    display: flex;
    gap: 8px;
}

.modal-window-header-button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
}

.ghost-button { background-color: #ffcc00; }
.close-button { background-color: #FF1E56; }
.close-button:hover { filter: brightness(1.2); transform: scale(1.1); }

.modal-window-content {
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 40px);
}

.modal-window-content::-webkit-scrollbar { width: 6px; }
.modal-window-content::-webkit-scrollbar-thumb { background: rgba(255, 30, 86, 0.2); border-radius: 10px; }

.modal-window-content button {
    border: none;
    border-radius: 20px;
    background: #FF1E56;
    color: white;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 30, 86, 0.3);
    margin: 4px 0;
}

.modal-window-content button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 30, 86, 0.4);
    background: #ff3a6d;
}

.modal-window-content button:active { transform: translateY(0); }

.toggle-button {
    min-width: 60px;
    background: rgba(255,255,255,0.1) !important;
    color: rgba(255,255,255,0.5) !important;
    box-shadow: none !important;
    font-size: 11px;
}

.toggle-button.active {
    background: #FF1E56 !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(255, 30, 86, 0.3) !important;
}

.modal-window-content input, .modal-window-content select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    padding: 6px 10px;
    margin: 4px 0;
    outline: none;
}

.modal-window-content input:focus { border-color: #FF1E56; background: rgba(255, 30, 86, 0.05); }

.modal-window-content label {
    display: block;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 10px;
    font-weight: 400;
}

.ghosted { opacity: 0.2; pointer-events: none; }
`;

    injectCss(css);

    return this;
};
