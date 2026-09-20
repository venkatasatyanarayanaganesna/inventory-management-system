const { test, expect } = require('@playwright/test');

// Each test uses a unique SKU (timestamp-based) so tests stay independent
// of each other and of whatever seed/leftover data already exists.
function uniqueSku(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

test.describe('Warehouse Inventory app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('item-table')).toBeVisible();
  });

  test('loads and displays seeded inventory items', async ({ page }) => {
    // The backend seeds a known item on startup (SKU-1001); confirm it renders.
    await expect(page.getByTestId('item-row-SKU-1001')).toBeVisible();
  });

  test('adding a new item makes it appear in the list', async ({ page }) => {
    const sku = uniqueSku('E2E');

    await page.getByTestId('add-item-button').click();
    await expect(page.getByTestId('item-form')).toBeVisible();

    await page.getByTestId('input-sku').fill(sku);
    await page.getByTestId('input-name').fill('E2E Test Widget');
    await page.getByTestId('input-category').fill('Testing');
    await page.getByTestId('input-quantity').fill('50');
    await page.getByTestId('input-reorder-threshold').fill('10');
    await page.getByTestId('input-unit-price').fill('4.99');
    await page.getByTestId('input-location').fill('Z-99-9');
    await page.getByTestId('submit-item').click();

    const row = page.getByTestId(`item-row-${sku}`);
    await expect(row).toBeVisible();
    await expect(row).toContainText('E2E Test Widget');
    await expect(row).toContainText('50');
  });

  test('editing an item updates its values in the list', async ({ page }) => {
    const sku = uniqueSku('EDIT');

    // Create an item to edit.
    await page.getByTestId('add-item-button').click();
    await page.getByTestId('input-sku').fill(sku);
    await page.getByTestId('input-name').fill('Item To Edit');
    await page.getByTestId('input-category').fill('Testing');
    await page.getByTestId('input-quantity').fill('20');
    await page.getByTestId('input-reorder-threshold').fill('5');
    await page.getByTestId('input-unit-price').fill('2.00');
    await page.getByTestId('input-location').fill('Y-01-1');
    await page.getByTestId('submit-item').click();
    await expect(page.getByTestId(`item-row-${sku}`)).toBeVisible();

    // Edit it.
    await page.getByTestId(`edit-${sku}`).click();
    await expect(page.getByTestId('item-form')).toBeVisible();
    await page.getByTestId('input-quantity').fill('99');
    await page.getByTestId('submit-item').click();

    const row = page.getByTestId(`item-row-${sku}`);
    await expect(row).toContainText('99');
  });

  test('deleting an item removes it from the list', async ({ page }) => {
    const sku = uniqueSku('DEL');

    await page.getByTestId('add-item-button').click();
    await page.getByTestId('input-sku').fill(sku);
    await page.getByTestId('input-name').fill('Item To Delete');
    await page.getByTestId('input-category').fill('Testing');
    await page.getByTestId('input-quantity').fill('10');
    await page.getByTestId('input-reorder-threshold').fill('5');
    await page.getByTestId('input-unit-price').fill('1.00');
    await page.getByTestId('input-location').fill('X-01-1');
    await page.getByTestId('submit-item').click();
    await expect(page.getByTestId(`item-row-${sku}`)).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId(`delete-${sku}`).click();

    await expect(page.getByTestId(`item-row-${sku}`)).not.toBeVisible();
  });

  test('search filters the list by name/SKU/category', async ({ page }) => {
    await page.getByTestId('search-input').fill('Forklift');
    await expect(page.getByTestId('item-row-SKU-2001')).toBeVisible();
    await expect(page.getByTestId('item-row-SKU-1001')).not.toBeVisible();
  });

  test('low stock filter shows only items at or below reorder threshold', async ({ page }) => {
    await page.getByTestId('low-stock-filter-checkbox').check();

    // SKU-2001 (Forklift Battery Pack) is seeded at qty 4, threshold 2 -- not low stock.
    // SKU-3002 (Shipping Label Roll) is seeded at qty 8, threshold 15 -- IS low stock.
    await expect(page.getByTestId('item-row-SKU-3002')).toBeVisible();
    await expect(page.getByTestId(`low-stock-badge-SKU-3002`)).toBeVisible();
  });

  test('creating an item with a duplicate SKU shows a validation error', async ({ page }) => {
    await page.getByTestId('add-item-button').click();
    await page.getByTestId('input-sku').fill('SKU-1001'); // already exists from seed data
    await page.getByTestId('input-name').fill('Duplicate Attempt');
    await page.getByTestId('input-category').fill('Testing');
    await page.getByTestId('input-quantity').fill('5');
    await page.getByTestId('input-reorder-threshold').fill('1');
    await page.getByTestId('input-unit-price').fill('1.00');
    await page.getByTestId('input-location').fill('W-01-1');
    await page.getByTestId('submit-item').click();

    await expect(page.getByTestId('form-error')).toBeVisible();
    await expect(page.getByTestId('form-error')).toContainText('already exists');
  });
});
