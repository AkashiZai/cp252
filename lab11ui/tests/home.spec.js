const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('Home Page (Inventory List)', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display correct title and header', async ({ page }) => {
    await expect(page).toHaveTitle('Inventory Tracker');
    await expect(homePage.heading).toHaveText('Inventory Items');
  });

  test('should display navigation links to Add Item ', async ({ page }) => {
    await expect(homePage.addNewItemLink).toBeVisible();
    await expect(homePage.addNewItemLink).toHaveAttribute('href', '/items/new');
  });

  test('should navigate to Add New Item page when clicking the link', async ({ page }) => {
    await homePage.clickAddNewItem();
    await expect(page).toHaveURL('/items/new');
    await expect(page.locator('h1')).toHaveText('Add New Item');
  });

});
