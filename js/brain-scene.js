/**
 * DESIGN FOR AN OPEN MIND — ULTRA-SHARP 3D VOLUMETRIC BRAIN & PARTICLE SCENE
 * High-definition, crisp 3D neural visualization with razor-sharp contrast.
 */
class BrainScene {
  constructor() {
    this.container = document.getElementById('webgl-container');
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 22;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    this.particleCount = 2200;
    this.particles = null;
    this.particleGeo = null;
    this.originalPositions = new Float32Array(this.particleCount * 3);
    this.explodedPositions = new Float32Array(this.particleCount * 3);
    this.reframedPositions = new Float32Array(this.particleCount * 3);
    this.colors = new Float32Array(this.particleCount * 3);

    this.brainMeshGroup = new THREE.Group();
    this.scene.add(this.brainMeshGroup);

    this.breakFactor = 0.0;
    this.reframeFactor = 0.0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.initGeometry();
    this.initSharpHeroCore();
    this.initSynapticFilaments();
    this.addEvents();
    this.animate();
  }

  initSharpHeroCore() {
    // Ultra-Sharp High-Definition Brain Core
    const loader = new THREE.TextureLoader();
    loader.load('assets/images/brain-hero.jpg', (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
      });

      this.heroSprite = new THREE.Sprite(spriteMat);
      this.heroSprite.scale.set(13.8, 13.8, 1);
      this.brainMeshGroup.add(this.heroSprite);
    });
  }

  initGeometry() {
    this.particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);

    const cyan = new THREE.Color(0x00f0ff);
    const violet = new THREE.Color(0xc084fc);
    const brightWhite = new THREE.Color(0xffffff);

    // Anatomical Dual-Hemisphere Shell
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const hemisphere = i % 2 === 0 ? 1 : -1;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const r = 5.4 + (Math.sin(theta * 6.0) * Math.cos(phi * 4.0) * 0.7) + (Math.random() * 0.4);
      
      let x = r * Math.sin(phi) * Math.cos(theta) * 0.92 + (hemisphere * 0.45);
      let y = r * Math.sin(phi) * Math.sin(theta) * 0.76;
      let z = r * Math.cos(phi) * 1.12;

      if (y < -2.2) {
        x *= 0.5;
        z *= 0.5;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      this.originalPositions[i3] = x;
      this.originalPositions[i3 + 1] = y;
      this.originalPositions[i3 + 2] = z;

      // Exploded positions
      const explodeDist = 25.0 + Math.random() * 35.0;
      const exDir = new THREE.Vector3(x, y, z).normalize();
      this.explodedPositions[i3] = exDir.x * explodeDist + (Math.random() - 0.5) * 8;
      this.explodedPositions[i3 + 1] = exDir.y * explodeDist + (Math.random() - 0.5) * 8;
      this.explodedPositions[i3 + 2] = exDir.z * explodeDist + (Math.random() - 0.5) * 8;

      // Reframed geometric constellation
      const refPhi = Math.acos(-1 + (2 * i) / this.particleCount);
      const refTheta = Math.sqrt(this.particleCount * Math.PI) * refPhi;
      const refR = 12.5 + Math.sin(refTheta * 4) * 2.5;
      this.reframedPositions[i3] = refR * Math.cos(refTheta) * Math.sin(refPhi);
      this.reframedPositions[i3 + 1] = refR * Math.sin(refTheta) * Math.sin(refPhi);
      this.reframedPositions[i3 + 2] = refR * Math.cos(refPhi);

      // Color mapping with high contrast
      let mixedColor = brightWhite.clone();
      const rand = Math.random();
      if (rand < 0.45) {
        mixedColor = cyan.clone();
      } else if (rand < 0.8) {
        mixedColor = violet.clone();
      }
      this.colors[i3] = mixedColor.r;
      this.colors[i3 + 1] = mixedColor.g;
      this.colors[i3 + 2] = mixedColor.b;
    }

    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // High-resolution sharp particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(0,240,255,0.9)');
    grad.addColorStop(0.7, 'rgba(168,85,247,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(this.particleGeo, mat);
    this.brainMeshGroup.add(this.particles);
  }

  initSynapticFilaments() {
    this.filaments = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5
    });

    for (let j = 0; j < 22; j++) {
      const points = [];
      for (let k = 0; k < 4; k++) {
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * 8.5,
          (Math.random() - 0.5) * 6.5,
          (Math.random() - 0.5) * 8.5
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(32);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const line = new THREE.Line(curveGeo, lineMat);
      this.filaments.add(line);
    }
    this.brainMeshGroup.add(this.filaments);
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const triggerBtn = document.getElementById('trigger-explosion-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        this.triggerExplosionEffect();
      });
    }
  }

  triggerExplosionEffect() {
    if (window.neuralAudio) window.neuralAudio.playBreakImpact();
    
    const flash = document.getElementById('break-flash');
    if (flash) {
      flash.style.opacity = '1';
      setTimeout(() => { flash.style.opacity = '0'; }, 350);
    }

    gsap.to(this, {
      breakFactor: 1.0,
      duration: 1.6,
      ease: 'power3.out',
      onComplete: () => {
        setTimeout(() => {
          gsap.to(this, {
            reframeFactor: 1.0,
            duration: 2.0,
            ease: 'elastic.out(1, 0.75)'
          });
        }, 1000);
      }
    });
  }

  updateScrollState(progress, sectionIndex) {
    if (sectionIndex === 1) {
      this.camera.position.z = 22 - progress * 3;
      this.breakFactor = 0;
      this.reframeFactor = 0;
    } else if (sectionIndex === 2) {
      this.camera.position.z = 19 - progress * 5;
    } else if (sectionIndex === 6) {
      this.breakFactor = Math.min(1, progress * 1.5);
    } else if (sectionIndex === 7) {
      this.breakFactor = 1.0;
      this.reframeFactor = Math.min(1, progress * 1.2);
    } else if (sectionIndex >= 8) {
      this.breakFactor = 1.0;
      this.reframeFactor = 1.0;
      this.camera.position.z = 16 - progress * 2;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Crisp breathing pulsation
    const breath = 1.0 + Math.sin(elapsedTime * 1.6) * 0.025;
    this.brainMeshGroup.scale.set(breath, breath, breath);

    this.brainMeshGroup.rotation.y = elapsedTime * 0.16 + this.mouse.x * 0.35;
    this.brainMeshGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.08 - this.mouse.y * 0.25;

    // Deconstruction & Reframe Particle Morphing
    if (this.particles && this.particleGeo) {
      const posAttr = this.particleGeo.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        
        let targetX = this.originalPositions[i3];
        let targetY = this.originalPositions[i3 + 1];
        let targetZ = this.originalPositions[i3 + 2];

        if (this.breakFactor > 0.001) {
          targetX = THREE.MathUtils.lerp(targetX, this.explodedPositions[i3], this.breakFactor);
          targetY = THREE.MathUtils.lerp(targetY, this.explodedPositions[i3 + 1], this.breakFactor);
          targetZ = THREE.MathUtils.lerp(targetZ, this.explodedPositions[i3 + 2], this.breakFactor);
        }

        if (this.reframeFactor > 0.001) {
          targetX = THREE.MathUtils.lerp(targetX, this.reframedPositions[i3], this.reframeFactor);
          targetY = THREE.MathUtils.lerp(targetY, this.reframedPositions[i3 + 1], this.reframeFactor);
          targetZ = THREE.MathUtils.lerp(targetZ, this.reframedPositions[i3 + 2], this.reframeFactor);
        }

        posArray[i3] += (targetX - posArray[i3]) * 0.12;
        posArray[i3 + 1] += (targetY - posArray[i3 + 1]) * 0.12;
        posArray[i3 + 2] += (targetZ - posArray[i3 + 2]) * 0.12;
      }
      posAttr.needsUpdate = true;
    }

    if (this.heroSprite) {
      this.heroSprite.material.opacity = Math.max(0.0, 0.95 * (1.0 - this.breakFactor));
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.brainScene = new BrainScene();
