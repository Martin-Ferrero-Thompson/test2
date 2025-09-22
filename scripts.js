// Scripts for riding4gbs.com

// ============== COUNTDOWN TIMER SCRIPT ==============
(function () {
  const TARGET_DATE = new Date("2026-09-30T08:30:00+02:00"); // 8:30 AM Madrid time for the ride start
  const END_URL = "#progress"; // Anchor link to the progress section

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
      msgEl.textContent = "The ride is underway! Follow the progress below.";
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
    
    const parts = [];
    if (years > 0) parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${years}</div><div class="text-xs">Year${years > 1 ? 's' : ''}</div></div>`);
    if (days > 0 || years > 0) parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${days}</div><div class="text-xs">Day${days > 1 ? 's' : ''}</div></div>`);
    if (hours > 0 || days > 0 || years > 0) parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${hours}</div><div class="text-xs">Hour${hours > 1 ? 's' : ''}</div></div>`);
    parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${minutes}</div><div class="text-xs">Minute${minutes > 1 ? 's' : ''}</div></div>`);
    parts.push(`<div class="text-center"><div class="font-bold text-2xl md:text-3xl">${seconds}</div><div class="text-xs">Second${seconds > 1 ? 's' : ''}</div></div>`);
    
    displayEl.innerHTML = parts.join('<div class="text-2xl md:text-3xl font-bold">:</div>');
    const targetLocaleString = TARGET_DATE.toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', timeZone: "Europe/Madrid" });
    msgEl.textContent = `The challenge begins on ${targetLocaleString}`;
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
})();


// ============== PROGRESS BAR SCRIPT ==============
(function () {
  // All our campaign data lives in this one object.
  // This is the ONLY place you'll make daily updates during the ride.
  const campaignConfig = {
    days: {
      label: "Days Completed",
      current: 3, // <-- UPDATE THIS NUMBER
      total: 21,
      unit: ''
    },
    distance: {
      label: "Distance Ridden",
      current: 756, // <-- UPDATE THIS NUMBER
      total: 1685,
      unit: 'km'
    },
    climbing: {
      label: "Metres Climbed",
      current: 5999, // <-- UPDATE THIS NUMBER
      total: 34900,
      unit: 'm'
    },
    funds: {
      label: "Funds Raised for GBS",
      current: 20, // <-- UPDATE THIS NUMBER
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

  const formattedCurrent = config.current.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
  
  // Update the text label
  labelEl.textContent = config.label;

  // Update the value - check if it's a progress stat or a simple stat
  if (config.total) {
    const formattedTotal = config.total.toLocaleString('en-US');
    valueEl.textContent = `${formattedCurrent} / ${formattedTotal} ${config.unit}`.trim();
  } else {
    valueEl.textContent = `${config.unit}${formattedCurrent}`;
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
updateStat('funds'); 
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
    dismiss.setAttribute('aria-label', 'Dismiss notification');
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

  link.addEventListener('click', function () {
    const message = this.getAttribute('data-toast-message') || 'Thanks! Your download is starting.';
    // Fire and forget toast. Do not block navigation; PDF opens in new tab if target set.
    showToast(message, { duration: 3500 });
  });
})();