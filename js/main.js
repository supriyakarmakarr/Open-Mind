/**
 * DESIGN FOR AN OPEN MIND — MASTER APP CONTROLLER
 * Coordinates HUD tracking, audio state, and seamless top-to-bottom narrative flow.
 */

// Ensure browser always starts at the top Hero section on page load/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  // Always initialize at the very top
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const stateLabel = document.getElementById('current-state-label');
  const navIndicator = document.querySelector('.nav-indicator-bar');
  const navItems = document.querySelectorAll('.nav-item');
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioStatusText = document.getElementById('audio-status-text');

  // Audio Toggle Controller
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (window.neuralAudio) {
        const isPlaying = window.neuralAudio.toggle();
        if (isPlaying) {
          audioBtn.classList.add('audio-playing');
          audioStatusText.textContent = 'SOUND: ON';
        } else {
          audioBtn.classList.remove('audio-playing');
          audioStatusText.textContent = 'SOUND: OFF';
        }
      }
    });
  }

  // Scroll Trigger Section Tracking
  const sections = document.querySelectorAll('section');

  sections.forEach((sec, idx) => {
    const stateName = sec.getAttribute('data-state-name') || `0${idx + 1} // STAGE`;
    const secNum = String(idx + 1).padStart(2, '0');

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => updateActiveSection(stateName, secNum, idx + 1),
        onEnterBack: () => updateActiveSection(stateName, secNum, idx + 1),
        onUpdate: (self) => {
          if (window.brainScene) {
            window.brainScene.updateScrollState(self.progress, idx + 1);
          }
        }
      });
    }
  });

  function updateActiveSection(stateName, secNum, secIndex) {
    if (stateLabel) {
      stateLabel.textContent = stateName;
    }

    // Update HUD Indicator
    navItems.forEach(item => {
      const itemSec = item.getAttribute('data-section');
      const innerDot = item.querySelector('.inner-dot');
      if (itemSec === secNum) {
        item.classList.add('active');
        if (innerDot) innerDot.style.backgroundColor = '#00f0ff';
      } else {
        item.classList.remove('active');
        if (innerDot) innerDot.style.backgroundColor = 'transparent';
      }
    });

    if (navIndicator) {
      const activeIdx = Math.min(secIndex - 1, navItems.length - 1);
      navIndicator.style.top = `${(activeIdx / (navItems.length - 1)) * 90}%`;
    }
  }

  console.log("%c DESIGN FOR AN OPEN MIND — ALL SYSTEMS OPERATIONAL %c", "background: #00f0ff; color: #000; font-weight: bold;", "background: #060709; color: #fff;");
});
