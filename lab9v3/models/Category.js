class CategoryManager {
  constructor() {
    this.categories = ['Electronics', 'Clothing', 'Books'];
  }

  getAll() {
    return this.categories;
  }

  create(name) {
    if (!this.categories.includes(name)) {
      this.categories.push(name);
      return true;
    }
    throw new Error("category existed error");
    console.log("Duplicate cateogry name");
    return false;
  }
}

// Export a single instance of the manager
module.exports = new CategoryManager();