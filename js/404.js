/**
 * Aalok Barnawal — 404 Error Page Scripts
 * Interactive 3D artwork tilt on fine pointer devices.
 */

document.addEventListener('DOMContentLoaded', () => {
  const art = document.querySelector('.error-art');
  const card = document.querySelector('.art-card');

  if (art && card && window.matchMedia('(pointer: fine)').matches) {
    art.addEventListener('mousemove', (event) => {
      const rect = art.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        rotate(7deg)
        perspective(900px)
        rotateY(${x * 8}deg)
        rotateX(${y * -8}deg)
        translateY(-5px)
      `;
    });

    art.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }
});
