(function () {

  /* ── Login password-toggle CSS ─────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent =
    '.login-pw-wrap{position:relative;}' +
    '.login-pw-wrap .form-input{padding-right:42px;}' +
    '.login-pw-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);' +
    'background:none;border:none;cursor:pointer;color:var(--text-muted,#666);' +
    'display:flex;align-items:center;padding:4px;opacity:0.5;transition:opacity .2s;}' +
    '.login-pw-eye:hover{opacity:1;}';
  document.head.appendChild(style);

  /* ── Phone formatter ────────────────────────────────────────────────── */
  function formatPhone(input) {
    var digits = input.value.replace(/\D/g, '').substring(0, 10);
    if (digits.length <= 3) {
      input.value = digits;
    } else if (digits.length <= 6) {
      input.value = digits.slice(0, 3) + '-' + digits.slice(3);
    } else {
      input.value = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    }
  }

  /* Attach to all current + future tel inputs via event delegation */
  document.addEventListener('input', function (e) {
    if (e.target && e.target.type === 'tel') {
      formatPhone(e.target);
    }
  });

  /* Set maxlength on existing tel inputs at load time */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[type="tel"]').forEach(function (el) {
      el.setAttribute('maxlength', '12');
    });
  });

  /* ── Login modal password toggle ────────────────────────────────────── */
  var EYE_OPEN =
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
    '<path d="M1.5 9C1.5 9 4 3.5 9 3.5C14 3.5 16.5 9 16.5 9C16.5 9 14 14.5 9 14.5C4 14.5 1.5 9 1.5 9Z"' +
    ' stroke="currentColor" stroke-width="1.3"/>' +
    '<circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.3"/></svg>';

  var EYE_SHUT =
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
    '<path d="M2 2L16 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M6.94 4.24C7.6 3.92 8.29 3.75 9 3.75C14 3.75 16.5 9 16.5 9' +
    'C16.05 9.91 15.45 10.74 14.72 11.44M10.88 10.88C10.61 11.14 10.28 11.35 9.93 11.48' +
    'C9.57 11.61 9.2 11.66 8.82 11.63C8.44 11.6 8.08 11.49 7.74 11.31' +
    'C7.41 11.12 7.12 10.87 6.9 10.56C6.67 10.25 6.52 9.9 6.47 9.52C6.41 9.15 6.44 8.77 6.56 8.41"' +
    ' stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M3.62 6.08C2.61 7.08 1.91 8.15 1.5 9C2 10.25 4.5 14.25 9 14.25' +
    'C10.73 14.25 12.26 13.62 13.52 12.73"' +
    ' stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';

  window.toggleLoginPw = function (btn) {
    var input = btn.previousElementSibling;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = show ? EYE_SHUT : EYE_OPEN;
    btn.style.opacity = show ? '0.9' : '0.5';
  };

})();
