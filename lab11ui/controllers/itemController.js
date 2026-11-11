const Item = require('../models/Item');
const Category = require('../models/Category');

module.exports = {
  getItems: (req, res) => {
    const items = Item.getAll();
    res.render('items/index', { items });
  },

  showCreateForm: (req, res) => {
    const categories = Category.getAll();
    res.render('items/create', { categories });
  },

  createItem: (req, res) => {
    const { name, category, detail } = req.body;
    Item.create(name, category, detail);
    console.log("Creating Item: "+ name);
    res.redirect('/');
  },

  showItem: (req, res) => {
    const item = Item.getById(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.render('items/show', { item });
  }
};
