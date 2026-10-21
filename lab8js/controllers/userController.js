const Data = require('../models/userData');
const User = require('../models/user');

var uData = new Data();
// Get all users
function getUsers(req, res) {
    // Render the users.ejs template with user data
    res.render('users', { users: uData.users, utotal: uData.n });
}

// Create a new user
function createUser(req, res) {
    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create user
    const newUser = new User(name,email); //{ name, email };
    uData.addUser(newUser);

    // Redirect to the users page after creating user
    res.redirect('/users');
}

// Remove alll user
function clearUser(req, res) {
  uData.clearUsers();
  res.redirect('/users');
}

module.exports = {
    getUsers,
    createUser,
    clearUser
};