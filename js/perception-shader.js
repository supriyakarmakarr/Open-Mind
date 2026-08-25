/**
 * DESIGN FOR AN OPEN MIND — PERCEPTION DISTORTION LENS (Section 04)
 */
class PerceptionDistortionLens {
  constructor() {
    this.canvas = document.getElementById('lens-distortion-canvas');
    this.wrapper = document.getElementById('perception-lens-wrapper');
    this.refractLabel = document.getElementById('refract-val');
    if (!this.canvas || !this.wrapper) return;

    this.ctx = this.canvas.getContext('2d');
    this.img = new Image();
    this.img.src = 'assets/images/eye-perception.jpg';

    this.mouse = { x: 0.5, y: 0.5, currentX: 0.5, currentY: 0.5 };
    this.isHovered = false;

    this.img.onload = () => {
      this.init();
    };
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.wrapper.addEventListener('mousemove', (e) => {
      const rect = this.wrapper.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) / rect.width;
      this.mouse.y = (e.clientY - rect.top) / rect.height;
      this.isHovered = true;

      // Update optical refraction indicator
      if (this.refractLabel) {
        const val = (1.33 + (this.mouse.x + this.mouse.y) * 0.22).toFixed(3);
        this.refractLabel.textContent = `${val} λ`;
      }
    });

    this.wrapper.addEventListener('mouseleave', () => {
      this.mouse.x = 0.5;
      this.mouse.y = 0.5;
      this.isHovered = false;
      if (this.refractLabel) this.refractLabel.textContent = '1.482 λ';
    });

    this.render();
  }

  resize() {
    const size = this.wrapper.clientWidth;
    this.canvas.width = size;
    this.canvas.height = size;
  }

  render() {
    requestAnimationFrame(() => this.render());

    // Lerp mouse
    this.mouse.currentX += (this.mouse.x - this.mouse.currentX) * 0.08;
    this.mouse.currentY += (this.mouse.y - this.mouse.currentY) * 0.08;

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w === 0 || h === 0) return;

    this.ctx.clearRect(0, 0, w, h);

    // Draw base image
    this.ctx.drawImage(this.img, 0, 0, w, h);

    // Draw chromatic aberration / refraction ripples
    if (this.isHovered) {
      const shiftX = (this.mouse.currentX - 0.5) * 16;
      const shiftY = (this.mouse.currentY - 0.5) * 16;

      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.globalAlpha = 0.35;
      this.ctx.drawImage(this.img, shiftX, shiftY, w, h);
      this.ctx.restore();

      // Refractive lens glare circle
      const grad = this.ctx.createRadialGradient(
        this.mouse.currentX * w,
        this.mouse.currentY * h,
        0,
        this.mouse.currentX * w,
        this.mouse.currentY * h,
        w * 0.45
      );
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
      grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PerceptionDistortionLens();
});
