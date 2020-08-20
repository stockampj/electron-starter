const lazyLoad = embla => {
  const slides = embla.slideNodes();
  const images = slides.map(slide => slide.querySelector(".embla__slide__img"));
  const imagesInView = [];

  const addImageLoadEvent = (image, callback) => {
    image.addEventListener("load", callback);
    return () => image.removeEventListener("load", callback);
  };

  const loadImagesInView = () => {
    embla
      .slidesInView(true)
      .filter(index => imagesInView.indexOf(index) === -1)
      .forEach(loadImageInView);
  };

  
  const loadImageInView = index => {
    const image = images[index];
    const slide = slides[index];
    imagesInView.push(index);
    image.src = image.getAttribute("data-src");
    const emblaViewDimensions = () =>{
      let box = document.querySelector('.embla');
      let dimensions = {
        width: box.clientWidth,
        height: box.clientHeight
      };
      return dimensions; 
    };

    const removeImageLoadEvent = addImageLoadEvent(image, () => {
      slide.classList.add("has-loaded");
      
      // Joel's Code
        let viewDimensions = emblaViewDimensions()
        let viewRatio = viewDimensions.width/viewDimensions.height;
        let imageRatio = image.width/image.height;
        const orientationClass = (imageRatio<=viewRatio) ? 'embla__slide__img__portrait' : 'embla__slide__img__landscape';
        image.classList.add(orientationClass);
      // end of Joel's Code
      
      removeImageLoadEvent();
    });
  };

  return () => {
    loadImagesInView();
    return imagesInView.length === images.length;
  };
};

module.exports = lazyLoad;
