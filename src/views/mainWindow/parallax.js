const PARALLAX_FACTOR = 1.2;

export const parallax = embla => {
  const scrollSnaps = embla.scrollSnapList();
  const slides = embla.slideNodes();
  const layers = slides.map(node =>
    node.querySelector(".embla__slide__parallax")
  );

  const applyParallaxStyles = () => {
    scrollSnaps.forEach((scrollSnap, index) => {
      const diffToTarget = scrollSnap - embla.scrollProgress();
      const x = diffToTarget * (-1 / PARALLAX_FACTOR) * 100;
      layers[index].style.transform = `translateX(${x}%)`;
    });
  };

  return applyParallaxStyles;
};

module.exports = parallax;