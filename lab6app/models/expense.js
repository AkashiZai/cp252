class Expense {
  /**
   * Represents an Expense.
   * @constructor
   * @param {string} date - The date of the expense.
   * @param {number} income - The income amount.
   * @param {number} expense - The expense amount.
   * @param {string} detail - Details or description of the transaction.
   */
  constructor(date, income, expense, detail) {
    this.date = date;
    this.income = parseFloat(income) || 0;
    this.expense = parseFloat(expense) || 0;
    this.detail = detail || '';
  }
}

/**
 * Class ExpenseModel.
 * @class
 */
class ExpenseModel {
  constructor() {
    this.expenses = [];
  }

  /**
   * Add an Expense object to the collection.
   * @param {Expense} expense - An instance of Expense.
   */
  add(expense) {
    this.expenses.push(expense);
  }

  /**
   * Return array of all expenses.
   * @return {Expense[]} Array of Expense instances.
   */
  getAll() {
    return this.expenses;
  }

  getTotalIncome() {
    return this.expenses.reduce((sum, exp) => sum + exp.income, 0);
  }

  getTotalExpense() {
    return this.expenses.reduce((sum, exp) => sum + exp.expense, 0);
  }

  getMoneyLeft() {
    return this.getTotalIncome() - this.getTotalExpense();
  }
}

module.exports = { Expense, ExpenseModel };