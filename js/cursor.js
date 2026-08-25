/**
 * DESIGN FOR AN OPEN MIND — CUSTOM MAGNETIC CURSOR
 */
class MagneticCursor {
  constructor() {
    this.cursorEl = document.getElementById('custom-cursor');
    this.dot = this.cursorEl ? this.cursorEl.querySelector('.cursor-dot') : null;
    this.ring = this.cursorEl ? this.cursorEl.querySelector('.cursor-ring') : null;
    
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.target = null;
    
    if (this.cursorEl) {
      this.init();
    }
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Attach hover listeners
    const hoverSelectors = 'a, button, .pipeline-card, .bias-fragment, .connection-node-badge, .team-node-card, #perception-lens-wrapper, #trigger-explosion-btn';
    
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (el.classList.contains('bias-fragment')) {
          document.body.classList.add('cursor-violet');
        } else if (el.id === 'trigger-explosion-btn') {
          document.body.classList.add('cursor-green');
        }
        if (window.neuralAudio) window.neuralAudio.playSynapseSpark(660, 0.08);
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-violet', 'cursor-green');
      });
    });

    this.render();
  }

  render() {
    // Lerp smooth follow
    this.pos.x += (this.mouse.x - this.pos.x) * 0.18;
    this.pos.y += (this.mouse.y - this.pos.y) * 0.18;

    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    }

    requestAnimationFrame(() => this.render());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MagneticCursor();
});
