// scripts/visitor-counter.js
// Uses GoatCounter (https://goatcounter.com) API to fetch and display visitor count
// on page load and display it in an element with id="vc-count".
// NOTE: CountAPI.xyz is no longer available (service shut down in 2023).
// This implementation uses a localStorage-based fallback for demonstration.

(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('vc-count');
    if (!el) return;

    // Use localStorage as a simple client-side counter
    // This counts page views per browser (not global/cross-user)
    // For a real visitor counter, you'll need a backend service
    try {
      var count = localStorage.getItem('visitor_count_v1');
      if (count === null) {
        count = 1;
      } else {
        count = parseInt(count, 10) + 1;
      }
      localStorage.setItem('visitor_count_v1', count);
      el.textContent = count.toLocaleString();
      
      // Add a small note to indicate this is a local counter
      var note = document.createElement('span');
      note.style.fontSize = '0.8em';
      note.style.color = '#666';
      note.style.marginLeft = '4px';
      note.textContent = '(this browser)';
      el.parentNode.appendChild(note);
    } catch (err) {
      console.warn('visitor counter error', err);
      el.textContent = '—';
    }
  });
})();
