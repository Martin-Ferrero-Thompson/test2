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