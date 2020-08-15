const electron = require('electron');
const {ipcRenderer} = electron;
const $ = require('jquery');
const hammerjs = require('hammerjs');
const materialize = require('materialize-css');


const ul = $('#happy-list')[0];
console.log(ul)
let itemIdNumber=0;

// Add Item
ipcRenderer.on('item:add', (e, item)=>{
  const li = document.createElement('li');
  const liText = document.createTextNode(item);
  li.appendChild(liText);
  li.id = itemIdNumber;
  itemIdNumber++;
  ul.appendChild(li);
})

// Clear Items
ipcRenderer.on('item:clear', ()=>{
  ul.innerHTML = '';
})
 
// Remove item via click
ul.addEventListener('dblclick', (event)=>{
  console.log(event.target)
  event.target.remove();
})