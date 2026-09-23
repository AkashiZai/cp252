const { Expense, ExpenseModel } = require('../models/expense');

const expenseModel = new ExpenseModel();

const expenseController = {
  index: (req, res) => {
    const expenses = expenseModel.getAll();
    const moneyLeft = expenseModel.getMoneyLeft();
    const today = new Date().toISOString().split('T')[0];
    
    res.render('index', { expenses, moneyLeft, today });
  },

  add: (req, res) => {
    const { date, income, expense, detail } = req.body;
    const newExpense = new Expense(date, income, expense, detail);
    expenseModel.add(newExpense);
    res.redirect('/');
  }
};

module.exports = expenseController;
