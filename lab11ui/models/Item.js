class Item {
  constructor(id, name, category, detail) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.detail = detail;
    this.comments = [];
  }

  addComment(comment) {
    this.comments.push({
      id: Date.now(),
      text: comment,
      timestamp: new Date()
    });
  }
}

class ItemManager {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  getAll() {
    return this.items;
  }

  getById(id) {
    return this.items.find(item => item.id == id);
  }

  create(name, category, detail) {
    const item = new Item(this.nextId++, name, category, detail);
    this.items.push(item);
    return item;
  }

  addComment(itemId, comment) {
    const item = this.getById(itemId);
    if (item) {
      item.addComment(comment);
      return true;
    }
    return false;
  }
}

// Export an instance of the manager so it acts as a shared module
module.exports = new ItemManager();