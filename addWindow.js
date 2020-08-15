const electron = require('electron');
const {ipcRenderer} = electron;
const $ = require('jquery');
const hammerjs = require('hammerjs');
const materialize = require('materialize-css');

const form = document.querySelector('form');
form.addEventListener('submit', (event)=>{
  event.preventDefault();
  const item = $('#item').val();
  ipcRenderer.send('item:add', item);
});
