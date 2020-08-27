const Store = require('electron-store');

class DataStore extends Store {
  constructor (settings) {
    super(settings);
    this.idCount = this.get('idCount')|| 0;
    this.itemList = this.get('itemList') || [];
  };
  
  getItems() {
    this.itemList = this.get('itemList') || [];
    return this;
  }

  addItem(item){
    this.idCount ++;
    this.set('idCount', this.idCount);
    item.id=this.idCount;
    this.itemList = [...this.itemList, item];
    this.set('itemList', this.itemList);
  }
  
  deleteItem(id){
    this.itemList = this.itemList.filter(item => item.id !== id);
    this.set('itemList', this.itemList);
  }

  saveItems(){
    this.set('itemList', this.itemList);
  }

};

module.exports = DataStore;