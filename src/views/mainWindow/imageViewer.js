//Embla imports
const EmblaCarousel = require('embla-carousel');
const { setupPrevNextBtns, disablePrevNextBtns } = require("./prevAndNextButton");
const lazyLoad = require("./lazyLoad");
const $ = require('jquery');


//This function will target a particular class, destroy any inner html, populate it with embla slides for each file in an array and then initialize embla functions

function imageViewer(fileArray, targetId){
  // show picture container
  $(`#${targetId}`).removeClass('hide')
  //destroy old carousel and create new one
  // picture-show
  $(`#${targetId}`).html('').append(()=>{
    const carouselHtml = `
    <div class="embla" id="embla">
      <div class="embla__viewport">
        <div class="embla__container carousel-root"></div>
      </div>
      <button class="embla__button embla__button--prev" type="button">
        <svg
          class="embla__button__svg"
          viewBox="137.718 -1.001 366.563 643.999"
        >
          <path
            d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z"
          ></path>
        </svg>
      </button>
      <button class="embla__button embla__button--next" type="button">
        <svg class="embla__button__svg" viewBox="0 0 238.003 238.003">
          <path
            d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z"
          ></path>
        </svg>
      </button>
    </div>
    `;
    return carouselHtml;
  })

  //populate carousel with images.
  $('.carousel-root').html(()=>{
    let htmlString = ''
    fileArray.forEach(file=>{
      htmlString += `
          <div class="embla__slide">
            <div class=embla__slide__inner>
              <img 
                class="embla__slide__img"
                src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" 
                data-src="${file.imagePath}"
                id="${file.imagePath}"
              />
            </div>
          </div>
      `
      // htmlString += `<a class="carousel-item" href="#"><img src='${file.imagePath}'></a>`
    })
    return htmlString
  });

  $('.embla__slide__img').on('click', (event)=>{
    console.log(event.target.id)
  })

  //initialize EmblaCarousel
  // const emblaNode = document.getElementById('embla')
  // console.log(emblaNode)
  // const embla = EmblaCarousel(emblaNode)


  const wrap = document.querySelector(".embla");
  const viewPort = wrap.querySelector(".embla__viewport");
  const prevBtn = wrap.querySelector(".embla__button--prev");
  const nextBtn = wrap.querySelector(".embla__button--next");
  const embla = EmblaCarousel(viewPort);

  const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);
  setupPrevNextBtns(prevBtn, nextBtn, embla);

  const loadImagesInView = lazyLoad(embla);
  const loadImagesInViewAndDestroyIfDone = eventName => {
    const loadedAll = loadImagesInView();
    if (loadedAll) embla.off(eventName, loadImagesInViewAndDestroyIfDone);
  };

  embla.on("init", disablePrevAndNextBtns);
  embla.on("select", disablePrevAndNextBtns);

  embla.on("init", loadImagesInViewAndDestroyIfDone);
  embla.on("select", loadImagesInViewAndDestroyIfDone);
  embla.on("resize", loadImagesInViewAndDestroyIfDone);
}

module.exports = imageViewer;
