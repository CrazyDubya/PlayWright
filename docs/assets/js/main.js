// Musical Reader - Accessibility Controls

(function() {
  'use strict';

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
    initializeBackToTop();
  });

  function initializeAccessibility() {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedDyslexia = localStorage.getItem('dyslexiaFont') === 'true';

    // Apply saved preferences
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    if (savedDyslexia) {
      document.body.classList.add('dyslexia-font');
    }

    // Add event listeners to controls if they exist
    setupThemeControls();
    setupFontSizeControls();
    setupDyslexiaControl();
  }

  function setupThemeControls() {
    const lightBtn = document.getElementById('theme-light');
    const darkBtn = document.getElementById('theme-dark');
    const systemBtn = document.getElementById('theme-system');

    if (lightBtn) {
      lightBtn.addEventListener('click', () => setTheme('light'));
    }
    if (darkBtn) {
      darkBtn.addEventListener('click', () => setTheme('dark'));
    }
    if (systemBtn) {
      systemBtn.addEventListener('click', () => setTheme('system'));
    }
  }

  function setupFontSizeControls() {
    const decreaseBtn = document.getElementById('font-decrease');
    const increaseBtn = document.getElementById('font-increase');
    const resetBtn = document.getElementById('font-reset');

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', decreaseFontSize);
    }
    if (increaseBtn) {
      increaseBtn.addEventListener('click', increaseFontSize);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => setFontSize('normal'));
    }
  }

  function setupDyslexiaControl() {
    const dyslexiaBtn = document.getElementById('dyslexia-toggle');
    if (dyslexiaBtn) {
      dyslexiaBtn.addEventListener('click', toggleDyslexiaFont);
      updateDyslexiaButton();
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active state on buttons
    document.querySelectorAll('[id^="theme-"]').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('theme-' + theme);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Announce to screen readers
    announceToScreenReader('Theme changed to ' + theme);
  }

  const fontSizes = ['small', 'normal', 'large', 'xlarge', 'xxlarge'];
  
  function setFontSize(size) {
    // Remove all font size classes
    fontSizes.forEach(s => {
      document.body.classList.remove('text-size-' + s);
    });
    
    // Add new font size class
    document.body.classList.add('text-size-' + size);
    localStorage.setItem('fontSize', size);
    
    // Announce to screen readers
    announceToScreenReader('Font size changed to ' + size);
  }

  function increaseFontSize() {
    const currentSize = getCurrentFontSize();
    const currentIndex = fontSizes.indexOf(currentSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1]);
    }
  }

  function decreaseFontSize() {
    const currentSize = getCurrentFontSize();
    const currentIndex = fontSizes.indexOf(currentSize);
    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1]);
    }
  }

  function getCurrentFontSize() {
    for (let size of fontSizes) {
      if (document.body.classList.contains('text-size-' + size)) {
        return size;
      }
    }
    return 'normal';
  }

  function toggleDyslexiaFont() {
    const isEnabled = document.body.classList.toggle('dyslexia-font');
    localStorage.setItem('dyslexiaFont', isEnabled);
    updateDyslexiaButton();
    
    // Announce to screen readers
    announceToScreenReader('Dyslexia-friendly font ' + (isEnabled ? 'enabled' : 'disabled'));
  }

  function updateDyslexiaButton() {
    const btn = document.getElementById('dyslexia-toggle');
    if (btn) {
      const isEnabled = document.body.classList.contains('dyslexia-font');
      btn.classList.toggle('active', isEnabled);
      btn.setAttribute('aria-pressed', isEnabled);
    }
  }

  function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function announceToScreenReader(message) {
    // Create or get the announcement element
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }
    
    // Clear and set new message
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }

  // Keyboard navigation enhancements
  document.addEventListener('keydown', function(e) {
    // Allow Escape key to close modals or return focus
    if (e.key === 'Escape') {
      // Add modal close logic if needed
    }
  });

  // Expose functions globally if needed
  window.MusicalReader = {
    setTheme: setTheme,
    setFontSize: setFontSize,
    toggleDyslexiaFont: toggleDyslexiaFont
  };
})();
