// scripts/visitor-counter.js
// Simple localStorage-based page view counter that displays in element with id="vc-count".
// NOTE: CountAPI.xyz (original plan) is no longer available (service shut down in 2023).
// This implementation tracks page views per browser, not global/cross-user visits.
// For a real global visitor counter, integrate with an analytics service or custom backend.

(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('vc-count');
    if (!el) return;

    // Use localStorage as a simple client-side counter
    // This counts page views per browser (not global/cross-user)
    try {
      var count = localStorage.getItem('visitor_count_v1');
      if (count === null) {
        count = 1;
      } else {
        count = parseInt(count, 10);
        count = isNaN(count) ? 1 : count + 1;
      }
      localStorage.setItem('visitor_count_v1', count);
      el.textContent = count.toLocaleString();
      
      // Add a small note to indicate this is a local counter (if not already present)
      if (!el.parentNode.querySelector('.vc-note')) {
        var note = document.createElement('span');
        note.className = 'vc-note';
        note.style.fontSize = '0.8em';
        note.style.color = '#666';
        note.style.marginLeft = '4px';
        note.textContent = '(this browser)';
        el.parentNode.appendChild(note);
      }
    } catch (err) {
      console.warn('visitor counter error', err);
      el.textContent = '—';
    }
  });
})();
