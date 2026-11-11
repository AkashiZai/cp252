class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.addNewItemLink = page.getByRole('link', { name: 'Add New Item' });
    this.addCategoryLink = page.getByRole('link', { name: 'Add Category' });
    this.noItemsMessage = page.getByText('No items found.');
    this.itemList = page.locator('ul');
    this.itemEntries = page.locator('ul li');
  }

  async goto() {
    await this.page.goto('/');
  }

  getItemLink(name) {
    return this.page.getByRole('link', { name, exact: true });
  }

  getItemEntry(name) {
    return this.itemEntries.filter({ hasText: name });
  }

  async clickAddNewItem() {
    await this.addNewItemLink.click();
  }

  async clickAddCategory() {
    await this.addCategoryLink.click();
  }
}

module.exports = { HomePage };
