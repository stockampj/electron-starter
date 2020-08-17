const electron = require('electron');
const {ipcRenderer} = electron;
const $ = require('jquery');
const path = require('path');
const fileObject = require('../../data/File_List');

let fileList = fileObject.fileList;

console.log(fileList)
// const hammerjs = require('hammerjs');
// const materialize = require('materialize-css');

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
  $('#picture-show').removeClass('hide')
  let files = Object.values(event.target.files).filter(function(file){
    return file.type.includes('image')===true;
  });
  const augmentedFiles = files.map(file=>{
    const imagePath = pathFinder(files[0], 'url')
    file.imagePath = imagePath;
    file.dimensions = imageSizeCheck(file)
    return file
  })
  console.log(augmentedFiles)
  // $('#picture-show').html(`<img src=${imagePath} />`);
  
  augmentedFiles.forEach(file=>{
    fileList.push(file)
  })
  console.log(fileList)
}, false);