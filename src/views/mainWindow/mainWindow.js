const electron = require('electron');
const {ipcRenderer} = electron;
const path = require('path');
const $ = require('jquery');
// const hammerjs = require('hammerjs');
// require('materialize-css');

//Embla imports
const EmblaCarousel = require('embla-carousel');
const { setupPrevNextBtns, disablePrevNextBtns } = require("./prevAndNextButton");
const lazyLoad = require("./lazyLoad");


let fileList = []

// receive file-List message from main processsor store
ipcRenderer.on('items-list', (event, updatedItems)=>{
  itemsList = JSON.parse(updatedItems);
  console.log(itemsList)
})

//send message and item to be added to store by main processor
const addItem = (item) => {
  stringItem = JSON.stringify(item);
  ipcRenderer.send('add-item', StringItem)
};

//send message and items list to be added to store by main processor
const addItems = (items) => {
  stringItems = JSON.stringify(items);
  ipcRenderer.send('add-items', stringItems)
};

//send id of item to be deleted from store by main processor
const deleteItem = (id) => {
  ipcRenderer.send('delete-item', id)
}

const getItems = () =>{
  ipcRenderer.send('get-items');
}


getItems();

const ul = $('#happy-list')[0];
let itemIdNumber=0;

// Add Item
ipcRenderer.on('item:add', (event, item)=>{
  const li = `<li id='item-${itemIdNumber}' class='collection-item'>${item}</li>`;
  itemIdNumber++;
  ul.innerHTML += li;
  if (ul.classList.contains('hide')){
    ul.classList.remove('hide');
  }
})

// Clear Items
ipcRenderer.on('item:clear', ()=>{
  ul.innerHTML = '';
  ul.classList.add('hide');
})
 
// Remove item via click
ul.addEventListener('dblclick', (event)=>{
  event.target.remove();
  if (ul.innerHTML === ''){
    ul.classList.add('hide');
  }
})

//Handle open add item window via button click
$("#create-item-button")[0].addEventListener('click', ()=>{
  ipcRenderer.send('createAddWindow');
})

// This will change file paths to relative URLs
function pathFinder (file, type){
  const fileLocation = file.path;
  const currentLocation = window.location.pathname
  let route = path.relative(currentLocation,fileLocation)
  let routeURL = route.replace(/\\/g, '/').replace(/ /g, '%20');
  return (type.toLowerCase() === 'url') ? routeURL: route;
}

// this will check the height and width of images and append those properties to the file object
function imageSizeCheck (file){
  let img = new Image()
  img.src = window.URL.createObjectURL(file)
  let dimensions = {
    width: 0,
    height: 0,
    orientation: 'not calculated'
  }
  img.onload = () => {
    dimensions.width = img.width;
    dimensions.height = img.height;
    dimensions.orientation = (img.width>=img.height) ? 'landscape' : 'portrait';
  }
  return dimensions;
}

document.getElementById("filepicker").addEventListener("change", function(event) {
  
  // show picture container
  $('#picture-show').removeClass('hide')
  
  //grab image files
  let files = Object.values(event.target.files).filter(function(file){
    return file.type.includes('image')===true;
  });
  
  // add properties of imagePath and dimensions to the images
  const augmentedFiles = files.map(file=>{
    const imagePath = pathFinder(file, 'url')
    // file.dimensions = imageSizeCheck(file)
    fileObject = {
      imagePath: imagePath,
      lastModified: file.lastModified,
      name: file.name,
      path: file.path,
      size: file.size,
      type: file.type
    }
    return fileObject;
  })
  
  // check to see if files are duplicates before pushing them into the main file array
  if (augmentedFiles.length>0){
    augmentedFiles.forEach(file=>{
      const pass = (fileList.filter(image => image.imagePath === file.imagePath).length > 0) ? false : true;
      if (pass){
        fileList.push(file)
      } else {
        console.log('duplicate')
      }
    })

    emblaRefresh(fileList, 'picture-show');
  }
  // console.log(fileList)
  addItems(fileList);
}, false);

//This function will target a particular class, destroy any inner html, populate it with embla slides for each file in an array and then initialize embla functions

function emblaRefresh(fileArray, targetId){
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

