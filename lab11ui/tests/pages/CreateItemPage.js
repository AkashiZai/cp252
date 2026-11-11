class CreateItemPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.nameInput = page.locator('input[name="name"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.detailTextarea = page.locator('textarea[name="detail"]');
    this.submitButton = page.getByRole('button', { name: 'Add Item' });
    this.backLink = page.getByRole('link', { name: 'Back to Items' });
  }

  async goto() {
    await this.page.goto('/items/new');
  }

  async fillForm({ name, category, detail }) {
    if (name !== undefined) {
      await this.nameInput.fill(name);
    }
    if (category !== undefined) {
      await this.categorySelect.selectOption(category);
    }
    if (detail !== undefined) {
      await this.detailTextarea.fill(detail);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async createItem({ name, category, detail }) {
    await this.fillForm({ name, category, detail });
    await this.submit();
  }

  async getCategoryOptions() {
    return this.categorySelect.locator('option').allTextContents();
  }

  async clickBack() {
    await this.backLink.click();
  }
}

module.exports = { CreateItemPage };
