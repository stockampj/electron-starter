const electron = require('electron');
const {ipcRenderer} = electron;
const path = require('path');
const $ = require('jquery');
// Carousel function
const imageViewer = require('./imageViewer')
const fileImporter = require('./fileImporter')
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


document.getElementById("filepicker").addEventListener("change", function(event) {
  const newFiles = Object.values(event.target.files);
  fileImporter(newFiles, fileList);
}, false);


