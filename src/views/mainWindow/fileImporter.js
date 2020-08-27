const electron = require('electron');
const {ipcRenderer} = electron;
const path = require('path');
const $ = require('jquery');

function importFiles(newFiles, masterFiles){
  
  //send message and items list to be added to store by main processor
  const addItems = (items) => {
    stringItems = JSON.stringify(items);
    ipcRenderer.send('add-items', stringItems)
  };
  const addItem = (item) => {
    stringItem = JSON.stringify(item);
    ipcRenderer.send('add-item', StringItem)
  };

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

  //grab image files
  let files = newFiles.filter(function(file){
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
      const pass = (masterFiles.filter(image => image.imagePath === file.imagePath).length > 0) ? false : true;
      return pass
    })
    addItems(passingFiles);
  }
}

module.exports = importFiles;