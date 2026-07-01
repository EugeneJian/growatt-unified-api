(function initProtocolLocaleUi(global) {
  const SUPPORTED_LOCALES = ["zh-CN", "en-US"];
  const DEFAULT_LOCALE = "zh-CN";
  const DEFAULT_STORAGE_KEY = "protocol-ssot-locale";
  const STYLE_ID = "protocol-locale-ui-style";

  const state = {
    locales: {},
    locale: DEFAULT_LOCALE,
    storageKey: DEFAULT_STORAGE_KEY,
    listeners: new Set(),
    initialized: false,
  };

  function esc(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
    }[char]));
  }

  function normalizeLocale(value) {
    const raw = String(value || "").trim();
    if (SUPPORTED_LOCALES.includes(raw)) return raw;
    const lower = raw.toLowerCase();
    if (lower === "zh" || lower.startsWith("zh-")) return "zh-CN";
    if (lower === "en" || lower.startsWith("en-")) return "en-US";
    return "";
  }

  function storedLocale(storageKey) {
    try {
      return normalizeLocale(global.localStorage?.getItem(storageKey));
    } catch {
      return "";
    }
  }

  function browserLocale() {
    const candidates = global.navigator?.languages?.length
      ? global.navigator.languages
      : [global.navigator?.language];
    for (const candidate of candidates) {
      const normalized = normalizeLocale(candidate);
      if (normalized) return normalized;
    }
    return "";
  }

  function resolveLocale(storageKey) {
    return storedLocale(storageKey) || browserLocale() || DEFAULT_LOCALE;
  }

  function dictionary() {
    return state.locales[state.locale] || state.locales[DEFAULT_LOCALE] || {};
  }

  function interpolate(text, vars = {}) {
    return String(text ?? "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
    ));
  }

  function t(key, vars = {}, fallback) {
    const value = dictionary()[key];
    return interpolate(value == null || value === "" ? (fallback ?? key) : value, vars);
  }

  function term(type, keyOrValue, vars = {}) {
    if (keyOrValue == null || keyOrValue === "") return "-";
    const key = String(keyOrValue);
    if (key.includes(".")) return t(key, vars, key);
    return t(`${type}.${key}`, vars, key);
  }

  function applyStatic(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });
    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.setAttribute("title", t(element.dataset.i18nTitle));
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });
    const titleKey = document.documentElement.dataset.i18nTitle || document.body?.dataset.i18nTitle;
    if (titleKey) document.title = t(titleKey);
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .protocol-locale-switch{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#657086}
      .protocol-locale-switch-label{font-weight:700}
      .protocol-locale-buttons{display:inline-flex;border:1px solid #dbe3ed;border-radius:999px;background:#fff;padding:2px;box-shadow:0 4px 12px rgba(20,35,60,.06)}
      .protocol-locale-button{border:0;border-radius:999px;background:transparent;color:#344057;cursor:pointer;font:inherit;font-weight:800;padding:4px 10px;line-height:1.2}
      .protocol-locale-button:hover{background:#f4f7fb}
      .protocol-locale-button.active{background:#2563eb;color:#fff}
      .protocol-locale-button:focus{outline:2px solid rgba(37,99,235,.35);outline-offset:2px}
    `;
    document.head.appendChild(style);
  }

  function notify() {
    state.listeners.forEach((listener) => listener(state.locale));
  }

  function setLocale(locale) {
    const normalized = normalizeLocale(locale) || DEFAULT_LOCALE;
    if (!SUPPORTED_LOCALES.includes(normalized)) return state.locale;
    state.locale = normalized;
    try {
      global.localStorage?.setItem(state.storageKey, normalized);
    } catch {
      // Local storage can be disabled in some embedded browsers.
    }
    document.documentElement.lang = normalized;
    applyStatic(document);
    notify();
    return state.locale;
  }

  function locale() {
    return state.locale;
  }

  function onChange(listener) {
    state.listeners.add(listener);
    return () => state.listeners.delete(listener);
  }

  function renderSwitch(target) {
    installStyles();
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    element.innerHTML = `
      <div class="protocol-locale-switch" role="group" aria-label="${esc(t("locale.switch_label"))}">
        <span class="protocol-locale-switch-label">${esc(t("locale.switch_label"))}</span>
        <span class="protocol-locale-buttons">
          ${SUPPORTED_LOCALES.map((item) => `
            <button class="protocol-locale-button ${item === state.locale ? "active" : ""}" type="button" data-locale="${esc(item)}">
              ${esc(t(`locale.${item}`))}
            </button>
          `).join("")}
        </span>
      </div>
    `;
    element.querySelectorAll("[data-locale]").forEach((button) => {
      button.addEventListener("click", () => setLocale(button.dataset.locale));
    });
  }

  function setTitle(key, vars = {}, fallback) {
    document.title = t(key, vars, fallback);
  }

  function init(options = {}) {
    state.locales = options.locales || state.locales || {};
    state.storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
    state.locale = normalizeLocale(options.locale) || resolveLocale(state.storageKey);
    if (!SUPPORTED_LOCALES.includes(state.locale)) state.locale = DEFAULT_LOCALE;
    state.initialized = true;
    document.documentElement.lang = state.locale;
    installStyles();
    applyStatic(document);
    return api;
  }

  const api = {
    supportedLocales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    init,
    locale,
    setLocale,
    onChange,
    t,
    term,
    applyStatic,
    renderSwitch,
    setTitle,
  };

  global.ProtocolLocaleUi = api;
}(window));
