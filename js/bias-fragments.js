/**
 * DESIGN FOR AN OPEN MIND — BIAS FRAGMENT GLITCH & DECODER (Section 05)
 */
class BiasFragmentEffects {
  constructor() {
    this.fragments = document.querySelectorAll('.bias-fragment');
    this.init();
  }

  init() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#@*!~';

    this.fragments.forEach(frag => {
      const heading = frag.querySelector('h3');
      if (!heading) return;
      const originalText = heading.innerText;

      frag.addEventListener('mouseenter', () => {
        let iteration = 0;
        clearInterval(frag.scrambleInterval);

        frag.scrambleInterval = setInterval(() => {
          heading.innerText = originalText
            .split('')
            .map((letter, index) => {
              if (index < iteration) return originalText[index];
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join('');

          if (iteration >= originalText.length) {
            clearInterval(frag.scrambleInterval);
          }
          iteration += 1 / 2;
        }, 30);
      });

      frag.addEventListener('mouseleave', () => {
        clearInterval(frag.scrambleInterval);
        heading.innerText = originalText;
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new BiasFragmentEffects();
});
