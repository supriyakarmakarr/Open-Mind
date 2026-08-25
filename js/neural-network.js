/**
 * DESIGN FOR AN OPEN MIND — INTERACTIVE LIVING NEURAL WEB (Section 03)
 */
class InteractiveNeuralWeb {
  constructor() {
    this.canvas = document.getElementById('neural-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.signals = [];
    this.nodeCount = window.innerWidth < 768 ? 45 : 90;
    this.maxDistance = 140;
    this.mouse = { x: -1000, y: -1000, radius: 180 };

    this.resize();
    this.initNodes();
    this.addEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseRadius: Math.random() * 2.2 + 1.2,
        energy: 0.2,
        color: Math.random() > 0.4 ? 'rgba(0,240,255,' : 'rgba(168,85,247,'
      });
    }
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initNodes();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.canvas.addEventListener('click', (e) => {
      this.createPulseWave(this.mouse.x, this.mouse.y);
      if (window.neuralAudio) window.neuralAudio.playSynapseSpark(580, 0.12);
    });
  }

  createPulseWave(x, y) {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 260) {
        node.energy = 1.0;
        this.signals.push({
          fromX: x,
          fromY: y,
          toX: node.x,
          toY: node.y,
          progress: 0,
          speed: 0.04 + Math.random() * 0.03
        });
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];

      // Physics move
      a.x += a.vx;
      a.y += a.vy;

      // Bounce boundaries
      if (a.x < 0 || a.x > this.canvas.width) a.vx *= -1;
      if (a.y < 0 || a.y > this.canvas.height) a.vy *= -1;

      // Mouse attraction & energy
      const dx = this.mouse.x - a.x;
      const dy = this.mouse.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 0.8;
        a.x += (dx / dist) * force;
        a.y += (dy / dist) * force;
        a.energy = Math.min(1.0, a.energy + 0.06);
      } else {
        a.energy = Math.max(0.15, a.energy - 0.008);
      }

      // Draw node core
      const currentRadius = a.baseRadius * (1 + a.energy * 1.4);
      this.ctx.beginPath();
      this.ctx.arc(a.x, a.y, currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${a.color}${0.3 + a.energy * 0.7})`;
      this.ctx.shadowBlur = a.energy * 15;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Connect to neighbors
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        const ndx = a.x - b.x;
        const ndy = a.y - b.y;
        const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

        if (nDist < this.maxDistance) {
          const alpha = (1 - nDist / this.maxDistance) * (0.15 + (a.energy + b.energy) * 0.35);
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 1.0 + (a.energy + b.energy) * 0.8;
          this.ctx.stroke();
        }
      }
    }

    // Render active electrical synaptic signals traveling along paths
    for (let s = this.signals.length - 1; s >= 0; s--) {
      const sig = this.signals[s];
      sig.progress += sig.speed;

      const curX = sig.fromX + (sig.toX - sig.fromX) * sig.progress;
      const curY = sig.fromY + (sig.toY - sig.fromY) * sig.progress;

      this.ctx.beginPath();
      this.ctx.arc(curX, curY, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (sig.progress >= 1) {
        this.signals.splice(s, 1);
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new InteractiveNeuralWeb();
});
