// CountAPI helper for simple page view counter
// Usage: initCountAPI({ namespace, elementId, increment, keyStrategy, globalKey, metaKeyName, featureFlag })
;(function(){
  function sanitizeKeyFromPath(path) {
    if (!path) path = '/';
    var p = path.replace(/^\/+|\/+$/g, '');
    if (!p) p = 'home';
    return p.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 200);
  }

  function updateElement(el, text) {
    if (!el) return;
    try { el.textContent = text; } catch (e) { /* ignore */ }
  }

  function defaultFetch(url) {
    if (typeof fetch === 'undefined') throw new Error('fetch-not-available');
    return fetch(url, { cache: 'no-store' });
  }

  function fetchCountWithFetch(fetchImpl, namespace, key, increment) {
    var method = increment ? 'hit' : 'get';
    var url = 'https://api.countapi.xyz/' + method + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key);
    return fetchImpl(url).then(function(res){
      if (!res || (res.ok === false && typeof res.ok !== 'undefined')) throw new Error('network');
      return res.json ? res.json() : Promise.resolve(res);
    });
  }

  function resolveKey(opts) {
    var strategy = opts.keyStrategy || 'path';
    if (strategy === 'global') return opts.globalKey || 'site';
    if (strategy === 'meta' && typeof opts.readMeta === 'function') {
      var metaVal = opts.readMeta(opts.metaKeyName || 'countapi-key');
      if (metaVal) return metaVal;
    }
    if (strategy === 'meta' && typeof document !== 'undefined') {
      var m = document.querySelector('meta[name="' + (opts.metaKeyName || 'countapi-key') + '"]');
      if (m && m.content) return m.content;
    }
    // default to path
    if (typeof location !== 'undefined') return sanitizeKeyFromPath(location.pathname || '/');
    return 'home';
  }

  function isEnabled(opts) {
    if (typeof opts.featureFlag !== 'undefined') return !!opts.featureFlag;
    // check meta tag or global var
    if (typeof opts.readMeta === 'function') {
      var meta = opts.readMeta('countapi-enabled');
      if (typeof meta !== 'undefined') return String(meta) === 'true';
    }
    if (typeof document !== 'undefined') {
      var m = document.querySelector('meta[name="countapi-enabled"]');
      if (m && m.content) return String(m.content) === 'true';
    }
    if (typeof window !== 'undefined' && typeof window.COUNTAPI_ENABLED !== 'undefined') return !!window.COUNTAPI_ENABLED;
    return true; // enabled by default
  }

  function initCountAPI(opts) {
    opts = opts || {};
    if (!isEnabled(opts)) return;
    var namespace = opts.namespace || 'default-namespace';
    var elementId = opts.elementId || 'page-count';
    var increment = typeof opts.increment === 'boolean' ? opts.increment : true;
    var getElement = opts.getElement || (function(id){ return (typeof document !== 'undefined') ? document.getElementById(id) : null; });
    var el = opts.element || getElement(elementId);
    if (!el) return; // nothing to update

    var key = opts.key || resolveKey(opts);

    // show a loading placeholder
    updateElement(el, '…');

    var fetchImpl = opts.fetch || defaultFetch;

    return fetchCountWithFetch(fetchImpl, namespace, key, increment).then(function(data){
      if (data && typeof data.value !== 'undefined') {
        updateElement(el, String(data.value));
      } else if (data && typeof data.count !== 'undefined') {
        updateElement(el, String(data.count));
      } else if (data && typeof data === 'number') {
        updateElement(el, String(data));
      } else {
        updateElement(el, '—');
      }
      return data;
    }).catch(function(err){
      updateElement(el, '—');
      if (typeof console !== 'undefined' && console.log) console.log('CountAPI error', err);
      return null;
    });
  }

  // expose globally
  if (typeof window !== 'undefined') window.initCountAPI = initCountAPI;
  // CommonJS export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initCountAPI: initCountAPI,
      _internals: {
        sanitizeKeyFromPath: sanitizeKeyFromPath,
        resolveKey: resolveKey,
        fetchCountWithFetch: fetchCountWithFetch,
        isEnabled: isEnabled
      }
    };
  }
})();
