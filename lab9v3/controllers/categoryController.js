const Category = require('../models/Category');

module.exports = {
  showCreateForm: (req, res) => {
    res.render('categories/create');
  },

  createCategory: (req, res) => {
    const { name } = req.body;
    Category.create(name);
    console.log("Creating Category: "+ name);
    res.redirect('/categories/new');
  }
};
