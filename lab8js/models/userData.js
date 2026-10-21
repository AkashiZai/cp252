const initialUsersData = require('./initdata');
const User = require('./user');

class UserData {
    constructor() {
        this.n = 0;
        this.users = [];
        initialUsersData.forEach(user => {
            const newUser = new User(user.name, user.email); 
            this.addUser(newUser);
        });
    }

    // Method to add a user
    addUser(user) {
        this.users.push(user);
        this.n = this.n + 1;
    }

    // Method to remove one user
    removeOneUser() {
        if ( this.users.length > 0 ) {
            this.n = this.n - 1;
            return this.users.pop();
        }else{
            return null
        }       
    }

    // Method to remove two users
    removeTwoUser() {
        this.removeOneUser();
        this.removeOneUser();
    }

    // Method to find user by email
    findUserbyEmail(email) {
        for (let user of this.users) {
            if (user.email === email) {
                return user.name;
            }
        }
        return null;
    }

    // Method to get user count
    getUserCount() {
        return this.n;
    }

    // Method to clear all users
    clearUsers() {
        this.users = [];
        this.n = 0;
    }
}

module.exports = UserData;