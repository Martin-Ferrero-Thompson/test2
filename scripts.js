// Scripts for riding4gbs.com

// ============== COUNTDOWN TIMER SCRIPT ==============
(function () {
  const TARGET_DATE = new Date("2026-09-30T08:30:00+02:00"); // 8:30 AM Madrid time for the ride start
  const END_URL = "#progress"; // Anchor link to the progress section

  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
  const i18n = {
    en: {
      begins: (dateStr) => `The challenge begins on ${dateStr}`,
      underway: 'The ride is underway! Follow the progress below.',
      units: {
        year: ['Year', 'Years'],
        day: ['Day', 'Days'],
        hour: ['Hour', 'Hours'],
        minute: ['Minute', 'Minutes'],
        second: ['Second', 'Seconds'],
      },
      dateLocale: 'en-GB',
    },
    es: {
      begins: (dateStr) => `El reto comienza el ${dateStr}`,
      underway: '¡La ruta está en marcha! Sigue el progreso más abajo.',
      units: {
        year: ['Año', 'Años'],
        day: ['Día', 'Días'],
        hour: ['Hora', 'Horas'],
        minute: ['Minuto', 'Minutos'],
        second: ['Segundo', 'Segundos'],
      },
      dateLocale: 'es-ES',
    }
  }[lang];

  const displayEl = document.getElementById("cd-display");
  const msgEl = document.getElementById("cd-message");
  const countdownContainer = document.getElementById("countdown");

  // Ensure elements exist before running
  if (!displayEl || !msgEl || !countdownContainer) {
    return;
  }

  function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      msgEl.classList.remove("hidden");
      msgEl.textContent = i18n.underway;
      countdownContainer.innerHTML = ""; // Clear the countdown numbers
      clearInterval(timer);
      return;
    }

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Simple pluralization
    const years = Math.floor(days / 365);
    days = days % 365;
    
  function label([singular, plural], n) { return n === 1 ? singular : plural; }
  const parts = [];
  if (years > 0) parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${years}</div><div class="text-xs">${label(i18n.units.year, years)}</div></div>`);
  if (days > 0 || years > 0) parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${days}</div><div class="text-xs">${label(i18n.units.day, days)}</div></div>`);
  if (hours > 0 || days > 0 || years > 0) parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${hours}</div><div class="text-xs">${label(i18n.units.hour, hours)}</div></div>`);
  parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${minutes}</div><div class="text-xs">${label(i18n.units.minute, minutes)}</div></div>`);
  parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${seconds}</div><div class="text-xs">${label(i18n.units.second, seconds)}</div></div>`);
    
    displayEl.innerHTML = parts.join('<div class="text-2xl md:text-3xl font-bold">:</div>');
    const targetLocaleString = TARGET_DATE.toLocaleString(i18n.dateLocale, { day: '2-digit', month: 'long', year: 'numeric', timeZone: "Europe/Madrid" });
    msgEl.textContent = i18n.begins(targetLocaleString);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
})();


// ============== PROGRESS BAR SCRIPT ==============
(function () {
  // All our campaign data lives in this one object.
  // This is the ONLY place you'll make daily updates during the ride.
  const isES = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().startsWith('es');
  const campaignConfig = {
    days: {
      label: isES ? "Días completados" : "Days Completed",
      current: 11, // <-- UPDATE THIS NUMBER
      total: 21,
      unit: ''
    },
    distance: {
      label: isES ? "Kilómetros recorridos" : "Distance Ridden",
      current: 730, // <-- UPDATE THIS NUMBER
      total: 1685,
      unit: 'km'
    },
    climbing: {
      label: isES ? "Metros ascendidos" : "Metres Climbed",
      current: 17900, // <-- UPDATE THIS NUMBER
      total: 34900,
      unit: 'm'
    },
    "funds-gbp": {
      label: isES ? "Fondos recaudados para GBS UK" : "Funds Raised for GBS UK",
      current: 2000.00, // <-- UPDATE THIS NUMBER (GBP). Decimals allowed, e.g., 2000.50
      unit: '£'
    },
    "funds-eur": {
      label: isES ? "Fondos recaudados para GBS UK" : "Funds Raised for GBS España",
      current: 4800.00, // <-- UPDATE THIS NUMBER (EUR). Decimals allowed, e.g., 4800.75
      unit: '€'
    }
  };

  // This function updates a single stat block in the HTML
function updateStat(statName) {
  const config = campaignConfig[statName];
  const statEl = document.getElementById(`${statName}-stat`);

  if (!config || !statEl) return;

  const valueEl = statEl.querySelector('.progress-value');
  const barEl = statEl.querySelector('.progress-bar');
  const labelEl = statEl.querySelector('.progress-label');
  
  if (!valueEl || !labelEl) return;

  const locale = isES ? 'es-ES' : 'en-GB';
  const numberFmt = new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedCurrent = numberFmt.format(config.current);
  
  // Update the text label
  labelEl.textContent = config.label;

  // Update the value - check if it's a progress stat or a simple stat
  if (config.total) {
    const formattedTotal = numberFmt.format(config.total);
    valueEl.textContent = `${formattedCurrent} / ${formattedTotal} ${config.unit}`.trim();
  } else {
    // Currency-only stats: follow currency-specific display rules (not page locale)
    // GBP: £ before number, comma thousands, dot decimals (en-GB)
    // EUR: period thousands, comma decimals, symbol after with space (es-ES)
    const unit = (config.unit || '').trim();
    const currency = unit === '€' ? 'EUR' : unit === '£' ? 'GBP' : null;
    if (currency) {
      try {
        const currencyLocale = currency === 'GBP' ? 'en-GB' : currency === 'EUR' ? 'es-ES' : locale;
        const currencyFmt = new Intl.NumberFormat(currencyLocale, {
          style: 'currency',
          currency,
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: 'always',
        });
        valueEl.textContent = currencyFmt.format(Number(config.current));
      } catch (e) {
        // Fallback if Intl fails for some reason
        const n = Number(config.current);
        const [intPartRaw, fracPartRaw] = n.toFixed(2).split('.');
        if (currency === 'GBP') {
          // Add comma thousands, dot decimals, symbol before
          const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          valueEl.textContent = `${unit}${intPart}.${fracPartRaw}`;
        } else if (currency === 'EUR') {
          // Add period thousands, comma decimals, symbol after with space
          const intPart = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          valueEl.textContent = `${intPart},${fracPartRaw} ${unit}`;
        } else {
          valueEl.textContent = `${n.toFixed(2)} ${unit}`.trim();
        }
      }
    } else {
      // Non-currency simple stat (shouldn't happen here, but safe fallback)
      valueEl.textContent = `${formattedCurrent} ${unit}`.trim();
    }
  }
  
  // Update the progress bar, if it exists
  if (barEl && config.total) {
    let percentage = (config.current / config.total) * 100;
    percentage = Math.min(percentage, 100);
    barEl.style.width = `${percentage}%`;
  }
}

// Update all stats on page load
updateStat('days');
updateStat('distance');
updateStat('climbing');
updateStat('funds-gbp');
updateStat('funds-eur'); 
})();


// ============== MOBILE MENU TOGGLE ==============
(function () {
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');

  if (!btn || !menu || !iconMenu || !iconClose) return;

  function openMenu() {
    menu.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    iconMenu.classList.add('hidden');
    iconClose.classList.remove('hidden');
  }

  function closeMenu() {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    iconMenu.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  function toggleMenu() {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  btn.addEventListener('click', toggleMenu);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Close when clicking outside the menu when open
  document.addEventListener('click', (e) => {
    const isClickInside = menu.contains(e.target) || btn.contains(e.target);
    if (!isClickInside && btn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // Close after navigating via a mobile link
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });
})();


// ============== SIMPLE TOASTS (SPONSORSHIP DOWNLOAD) ==============
(function () {
  const link = document.getElementById('sponsor-download');
  if (!link) return; // Not on this page

  const isES = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().startsWith('es');

  function ensureRoot() {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.setAttribute('aria-live', 'polite');
      root.setAttribute('aria-atomic', 'true');
      document.body.appendChild(root);
    }
    // Ensure positioning even if Tailwind classes aren't available
    root.style.position = 'fixed';
    root.style.left = '0';
    root.style.right = '0';
    root.style.bottom = '24px';
    root.style.display = 'flex';
    root.style.justifyContent = 'center';
    root.style.pointerEvents = 'none';
    root.style.zIndex = '99999';
    return root;
  }

  function showToast(message, opts = {}) {
    const { duration = 3000 } = opts;
    const root = ensureRoot();

    // Toast element
    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    // Inline styles for reliability
    toast.style.pointerEvents = 'auto';
    toast.style.margin = '0 16px';
    toast.style.minWidth = '240px';
    toast.style.maxWidth = '420px';
    toast.style.borderRadius = '12px';
    toast.style.background = '#111827'; // gray-900
    toast.style.color = '#fff';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)';
    toast.style.padding = '12px 16px';
    toast.style.display = 'flex';
    toast.style.alignItems = 'flex-start';
    toast.style.gap = '12px';
    toast.style.transform = 'translateY(16px)';
    toast.style.opacity = '0';
    toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.style.width = '20px';
    icon.style.height = '20px';
    icon.style.marginTop = '2px';
    icon.style.color = '#34D399'; // green-400
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M5 13l4 4L19 7');
    icon.appendChild(path);

    const text = document.createElement('div');
    text.style.fontSize = '14px';
    text.textContent = message;

    // Dismiss button
  const dismiss = document.createElement('button');
    dismiss.setAttribute('type', 'button');
  dismiss.setAttribute('aria-label', isES ? 'Cerrar notificación' : 'Dismiss notification');
    dismiss.style.marginLeft = 'auto';
    dismiss.style.color = 'rgba(255,255,255,0.7)';
    dismiss.style.background = 'transparent';
    dismiss.style.border = 'none';
    dismiss.style.cursor = 'pointer';
    dismiss.style.fontSize = '18px';
    dismiss.textContent = '×';

    dismiss.addEventListener('click', () => removeToast());

    function removeToast() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      setTimeout(() => {
        root.removeChild(toast);
      }, 300);
    }

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(dismiss);
  root.appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // auto dismiss
    const t = setTimeout(removeToast, duration);

    // Pause timer on hover
    toast.addEventListener('mouseenter', () => clearTimeout(t));
  }

  // Modal behavior (re-query elements at interaction time to avoid load-order issues)
  const mainRoot = document.querySelector('main');

  function getModalEls() {
    const modal = document.getElementById('sponsor-modal');
    const modalClose = document.getElementById('sponsor-modal-close');
    const modalOverlay = modal ? modal.querySelector('[data-modal-close]') : null;
    return { modal, modalClose, modalOverlay };
  }

  function openModal() {
    const { modal, modalClose, modalOverlay } = getModalEls();
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (mainRoot) mainRoot.setAttribute('aria-hidden', 'true');
    // focus close button for accessibility
    if (modalClose) modalClose.focus();
    // lazily bind close handlers once per open if not already
    if (modal && !modal.dataset.bound) {
      if (modalClose) modalClose.addEventListener('click', closeModal);
      if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
      modal.dataset.bound = 'true';
    }
  }

  function closeModal() {
    const { modal } = getModalEls();
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (mainRoot) mainRoot.removeAttribute('aria-hidden');
    // return focus to trigger
    link.focus();
  }

  link.addEventListener('click', function (e) {
    if (this.getAttribute('data-modal') === 'true') {
      e.preventDefault();
      openModal();
      return;
    }
    const message = this.getAttribute('data-toast-message') || (isES ? '¡Gracias! Tu descarga está comenzando.' : 'Thanks! Your download is starting.');
    showToast(message, { duration: 3500 });
  });

  document.addEventListener('keydown', (e) => {
    const { modal } = getModalEls();
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();


// ============== LANGUAGE SWITCH: PRESERVE CURRENT SECTION ==============
(function () {
  const links = document.querySelectorAll('a[data-lang]');
  if (!links.length) return;

  function getCurrentAnchor() {
    if (window.location.hash && window.location.hash.length > 1) {
      return window.location.hash;
    }
    const header = document.querySelector('header');
    const headerH = header ? header.offsetHeight : 72;
    const scrollTop = window.scrollY + headerH + 16;
    const sections = document.querySelectorAll('section[id]');
    let best = '';
    let bestDist = Infinity;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const dist = Math.abs(scrollTop - top);
      if (dist < bestDist) {
        bestDist = dist;
        best = '#' + sec.id;
      }
    });
    return best;
  }

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
      const baseHref = link.getAttribute('href') || '';
      if (!baseHref) return;
      const anchor = getCurrentAnchor();
      const finalHref = anchor ? `${baseHref}${anchor}` : baseHref;
      e.preventDefault();

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const supportsViewTransitions = typeof document.startViewTransition === 'function';

      if (!prefersReduced && supportsViewTransitions) {
        // Cross-document view transition for smoother swap
        document.startViewTransition(() => {
          window.location.href = finalHref;
        });
      } else {
        // Fallback: quick fade-out then navigate
        const root = document.documentElement;
        root.classList.add('lang-switch-fade');
        setTimeout(() => { window.location.href = finalHref; }, 120);
      }
    });
  });
})();