const electron = require('electron');
const {ipcRenderer} = electron;
const $ = require('jquery');
const path = require('path');
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

ipcRenderer.on('RogerRoger', (event, message)=>{
  console.log(message);
})

function pathFinder (file, type){
  const fileLocation = file.path;
  const currentLocation = window.location.pathname
  let route = path.relative(currentLocation,fileLocation)
  let routeURL = route.replace(/\\/g, '/').replace(/ /g, '%20');
  return (type.toLowerCase() === 'url') ? routeURL: route;
}

document.getElementById("filepicker").addEventListener("change", function(event) {
  let files = Object.values(event.target.files).filter(function(file){
    return file.type.includes('image')===true;
  });

  let imagePath = pathFinder(files[0], 'url')
  $('#picture-show').removeClass('hide')
  $('#picture-show').html(`<img src=${imagePath} />`);


}, false);