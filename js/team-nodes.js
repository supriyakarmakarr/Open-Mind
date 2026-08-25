/**
 * DESIGN FOR AN OPEN MIND — TEAM SYNAPTIC BRIDGE (Section 10)
 * Renders an animated energetic synaptic beam connecting Supriya and Trijusha.
 */
class SynapseBridge {
  constructor() {
    this.canvas = document.getElementById('synapse-bridge-canvas');
    this.node1 = document.getElementById('node-member-01');
    this.node2 = document.getElementById('node-member-02');
    if (!this.canvas || !this.node1 || !this.node2) return;

    this.ctx = this.canvas.getContext('2d');
    this.pulses = [];
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate periodic pulses traveling between the two creators
    setInterval(() => {
      if (document.hidden) return;
      this.pulses.push({
        t: 0,
        speed: 0.015 + Math.random() * 0.01,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7'
      });
    }, 450);

    this.render();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  render() {
    requestAnimationFrame(() => this.render());

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const rect1 = this.node1.getBoundingClientRect();
    const rect2 = this.node2.getBoundingClientRect();
    const parentRect = this.canvas.getBoundingClientRect();

    const p1 = {
      x: rect1.left + rect1.width / 2 - parentRect.left,
      y: rect1.top + rect1.height * 0.35 - parentRect.top
    };
    const p2 = {
      x: rect2.left + rect2.width / 2 - parentRect.left,
      y: rect2.top + rect2.height * 0.35 - parentRect.top
    };

    // Draw Synaptic Bezier Bridge Curve
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2 - 40;

    // Glowing base line
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Render traveling electrical charges
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.t += pulse.speed;

      const progress = pulse.direction === 1 ? pulse.t : 1 - pulse.t;

      // Quadratic Bezier interpolation
      const invT = 1 - progress;
      const curX = invT * invT * p1.x + 2 * invT * progress * midX + progress * progress * p2.x;
      const curY = invT * invT * p1.y + 2 * invT * progress * midY + progress * progress * p2.y;

      this.ctx.beginPath();
      this.ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = pulse.color;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = pulse.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (pulse.t >= 1) {
        this.pulses.splice(i, 1);
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SynapseBridge();
});
