// scripts/visitor-counter.js
// Uses CountAPI (https://countapi.xyz) to increment and read a visitor counter
// on page load and display it in an element with id="vc-count".
// NOTE: This script applies a display offset (DISPLAY_OFFSET) so the shown
// value = remote_count + DISPLAY_OFFSET. The remote CountAPI value itself
// is only incremented by the single hit performed by the request below.

(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('vc-count');
    if (!el) return;

    // Display offset applied to the returned CountAPI value.
    var DISPLAY_OFFSET = 200; // <-- shows remote_value + 200

    // Namespace and key used for CountAPI. Change if you want different counters.
    var namespace = 'goodgoys_thor';
    var key = 'homepage';
    // The 'hit' endpoint increments by 1 and returns the new value.
    var url = 'https://api.countapi.xyz/hit/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key);

    // Hit the counter and display the returned value + offset.
    fetch(url, { method: 'GET' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && typeof data.value !== 'undefined') {
          // Display remote value plus offset
          try {
            var displayVal = Number(data.value) + Number(DISPLAY_OFFSET);
            el.textContent = String(displayVal);
          } catch (e) {
            el.textContent = String(data.value);
          }
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
