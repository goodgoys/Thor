// CountAPI helper for simple page view counter
// Usage: initCountAPI({ namespace: 'your-namespace', elementId: 'page-count', increment: true });
(function(){
  function sanitizeKeyFromPath(path) {
    if (!path) path = '/';
    // trim leading/trailing slashes
    var p = path.replace(/^\/+|\/+$/g, '');
    if (!p) p = 'home';
    // replace unsafe chars with hyphens
    return p.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 200);
  }

  function updateElement(el, text) {
    if (!el) return;
    try { el.textContent = text; } catch (e) { /* ignore */ }
  }

  function fetchCount(namespace, key, increment) {
    var method = increment ? 'hit' : 'get';
    var url = 'https://api.countapi.xyz/' + method + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key);
    return fetch(url, { cache: 'no-store' }).then(function(res){
      if (!res.ok) throw new Error('network');
      return res.json();
    });
  }

  function initCountAPI(opts) {
    opts = opts || {};
    var namespace = opts.namespace || 'default-namespace';
    var elementId = opts.elementId || 'page-count';
    var increment = typeof opts.increment === 'boolean' ? opts.increment : true;
    var el = document.getElementById(elementId);
    if (!el) return; // nothing to update

    var key = opts.key || sanitizeKeyFromPath(location.pathname || '/');

    // show a loading placeholder
    updateElement(el, '…');

    fetchCount(namespace, key, increment).then(function(data){
      if (data && typeof data.value !== 'undefined') {
        updateElement(el, String(data.value));
      } else if (data && typeof data.count !== 'undefined') {
        updateElement(el, String(data.count));
      } else {
        updateElement(el, '—');
      }
    }).catch(function(err){
      updateElement(el, '—');
      console.log('CountAPI error', err);
    });
  }

  // expose globally
  window.initCountAPI = initCountAPI;
})();
