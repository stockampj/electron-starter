const electron = require('electron');
const {ipcRenderer} = electron;
const path = require('path');
const $ = require('jquery');
// Carousel function
const imageViewer = require('./imageViewer')
// const hammerjs = require('hammerjs');
// require('materialize-css');

let fileList = []

// receive file-List message from main processsor store
ipcRenderer.on('items-list', (event, updatedItems)=>{
  itemsList = JSON.parse(updatedItems);
  console.log(itemsList)
  fileList = [...itemsList];
  imageViewer(fileList, 'picture-show');
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
    const passingFiles = augmentedFiles.filter(file=>{
      const pass = (fileList.filter(image => image.imagePath === file.imagePath).length > 0) ? false : true;
      return pass
    })
    addItems(passingFiles);
  }
}, false);


