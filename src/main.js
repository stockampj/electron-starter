const electron = require('electron')
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = electron;
const DataStore = require('./data/DataStore');

//create data store
const sessionData = new DataStore({name: 'session_data'});
const userData = new DataStore({name: 'user_data'});

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', ()=>{
  //create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  //load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './views/mainWindow/mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Quit Application
  mainWindow.on('close', ()=>{
    app.quit();
  })

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
})

//Handle add window creation
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'test Window',
    webPreferences: {
      nodeIntegration: true
    }
  });

  //load html into addWindow
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, './views/addWindow/addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Garbage Collection handle
  addWindow.on('close', ()=>{
    addWindow = null;
  })
}

//catch item:add
ipcMain.on('item:add', (e, item)=>{
  mainWindow.webContents.send('item:add', item);
  addWindow.close()
})

//catch item:create
ipcMain.on('createAddWindow', (event)=>{
  createAddWindow();
})

//add item to items list in store
ipcMain.on('add-item', (event, item)=> {
  const updatedItems = sessionData.addItem(JSON.parse(item));
  mainWindow.webContents.send('items-list', updatedItems)
})

ipcMain.on('add-items', (event, items)=> {
  itemsList = JSON.parse(items)
  itemsList.forEach(item=>{
    sessionData.addItem(item);
  })
  let updatedItems = JSON.stringify(sessionData.getItems());
  mainWindow.webContents.send('items-list', updatedItems);
})

//delete item from items list in store
ipcMain.on('delete-item', (event, id)=>{
  const updatedItems = JSON.stringify(sessionData.deleteItem(id))
  mainWindow.webContents.send('items-list', updatedItems)
})

ipcMain.on('get-items', (event)=>{
  let updatedItems = JSON.stringify(sessionData.getItems());
  mainWindow.webContents.send('items-list', updatedItems)
})


// Create Menu Template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q', 
        click(){
          app.quit();
        }
      }
    ]
  }
]

// add empty menu for mac users
if (process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

//add devtools while in development
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'toggle Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I', 
        click(item, focusedWindow){
          focusedWindow.toggleDevTools(); 
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}