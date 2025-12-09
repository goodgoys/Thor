// scripts/visitor-counter.js
// Uses CountAPI (https://countapi.xyz) to increment and read a visitor counter
// on page load and display it in an element with id="vc-count".

(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('vc-count');
    if (!el) return;

    // Namespace and key used for CountAPI. Change if you want different counters.
    var namespace = 'goodgoys_thor';
    var key = 'homepage';
    var url = 'https://api.countapi.xyz/hit/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key);

    // Hit the counter and display the returned value.
    fetch(url, { method: 'GET' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && typeof data.value !== 'undefined') {
          el.textContent = data.value;
        } else {
          el.textContent = '—';
        }
      })
      .catch(function (err) {
        // Don't break the page if the request fails.
        console.warn('visitor counter error', err);
        el.textContent = '—';
      });
  });
})();
