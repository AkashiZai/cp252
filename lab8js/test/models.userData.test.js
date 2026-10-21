const User = require('../models/user');
const UserData = require('../models/userData');

// Count method
describe('Count user', () => {
    test('default user count', () => {
      testUserData = new UserData();  
      const userCount = testUserData.getUserCount();
      expect(userCount).toEqual(4);
    })

    test('clear user and Count', () => {
        testUserData = new UserData(); 
        testUserData.clearUsers()
        const userCount = testUserData.getUserCount();
        expect(userCount).toEqual(0);
    })
})

// Remove user
describe('remove user', () => {
    test('Remove one', () => {
      testUserData = new UserData();
      const userCountBefore = testUserData.getUserCount();
      testUserData.removeOneUser();
      const userCountAfter = testUserData.getUserCount();
      const difUser = userCountBefore - userCountAfter;
      expect(difUser).toEqual(1);
    })

    test('Remove two', () => {
      testUserData = new UserData();
      const userCountBefore = testUserData.getUserCount();
      testUserData.removeTwoUser();
      const userCountAfter = testUserData.getUserCount();
      const difUser = userCountBefore - userCountAfter;
      expect(difUser).toEqual(2);
    })

    test('Remove two after clear', () => {
      testUserData = new UserData();
      testUserData.clearUsers();
      testUserData.removeTwoUser();
      const userCount = testUserData.getUserCount();
      expect(userCount).toEqual(0);
    })
})

// Find user by email
describe('find user by email', () => {
    test('find existing user', () => {
      testUserData = new UserData();
      const username = testUserData.findUserbyEmail('alice@example.com');
      expect(username).toEqual('Alice');
    })

    test('find non-existing user', () => {
      testUserData = new UserData();
      const username = testUserData.findUserbyEmail('notfound@example.com');
      expect(username).toBeNull();
    })
})