const electron = require('electron');
const {ipcRenderer} = electron;
const $ = require('jquery');
const path = require('path');
// const hammerjs = require('hammerjs');
const materialize = require('materialize-css');

let fileList = []

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
    height: 0
  }
  img.onload = () => {
    dimensions.width = img.width;
    dimensions.height = img.height;
  }
  return dimensions;
}

// This function listens for the user to pick a directory and then pulls all images into an array
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
    file.imagePath = imagePath;
    file.dimensions = imageSizeCheck(file)
    return file;
  })
  
  // check to see if files are duplicates before pushing them into the main file array
  if (augmentedFiles.length>0){
    augmentedFiles.forEach(file=>{
      let pass = (fileList.filter(image => image.imagePath === file.imagePath).length > 0) ? false : true;
      // console.log(`${file.name}: ${pass}`)
      // console.log(file.imagePath)
      if (pass){
        fileList.push(file)
      } else {
        console.log('duplicate')
      }
    })
    //populate carousel with images.
    $('#picture-show').html('');
    $('#picture-show').html(()=>{
      let htmlString = ''
      fileList.forEach(file=>{
        htmlString += `<a class="carousel-item" href="#"><img src='${file.imagePath}'></a>`
      })
      return htmlString
    });
    // $('.carousel').carousel();
    let elems = document.querySelectorAll('.carousel');
    let instances = M.Carousel.init(elems);
  }

  // $('#picture-show').html(`<img src=${augmentedFiles[0].imagePath} />`);
  
  console.log(fileList)
}, false);