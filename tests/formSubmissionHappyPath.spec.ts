import { test, expect } from '@playwright/test';
const baseURL = 'https://practice.qabrains.com/';
test.describe('Form Submission Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    await page.getByText('Form Submission').click();
    await expect(page.getByRole('heading', { name: 'Form Submission' })).toBeVisible();
  });

  test('verify page navigation and heading', async ({ page }) => {
    await expect(page).toHaveURL(`${baseURL}form-submission`);
    await expect(page.getByRole('heading', { name: 'Form Submission' })).toBeVisible();
    await expect(page.getByText('Name*')).toBeVisible();
  });

  test('fill name field', async ({ page }) => {
    const nameField = page.getByRole('textbox', { name: 'Name*' });
    await expect(nameField).toBeVisible();
    await nameField.click();
    await nameField.fill('SQA');
    await expect(nameField).toHaveValue('SQA');
  });

  test('fill email field', async ({ page }) => {
    const emailField = page.getByRole('textbox', { name: 'Email*' });
    await expect(emailField).toBeVisible();
    await emailField.click();
    await emailField.fill('sqa@gmail.com');
    await expect(emailField).toHaveValue('sqa@gmail.com');
  });

  test('fill contact number field', async ({ page }) => {
    const contactField = page.getByRole('textbox', { name: 'Contact Number*' });
    await expect(contactField).toBeVisible();
    await contactField.fill('01749884543');
    await expect(contactField).toHaveValue('01749884543');
  });

  test('fill date field', async ({ page }) => {
    const dateField = page.getByRole('textbox', { name: 'Date' });
    await expect(dateField).toBeVisible();
    await dateField.fill('2000-07-05');
    await expect(dateField).toHaveValue('2000-07-05');
  });

  test('upload file', async ({ page }) => {
     const uploadButton = page.getByRole('button', { name: 'Upload File*' });
  await expect(uploadButton).toBeVisible();

  const fileInput = page.locator('input[type="file"]');

  // Set file after clicking button (if input appears only after click)
  await uploadButton.click();
  await fileInput.setInputFiles('tests/assets/cat.jpg');
  });

  test('select radio buttons - colors', async ({ page }) => {
    // Test Red radio button
    const redRadio = page.getByRole('radio', { name: 'Red' });
    await expect(redRadio).toBeVisible();
    await redRadio.check();
    await expect(redRadio).toBeChecked();

    // Test Green radio button using label filter
    const greenLabel = page.locator('label').filter({ hasText: 'Green' });
    await expect(greenLabel).toBeVisible();
    await greenLabel.click();
    const greenRadio = page.getByRole('radio', { name: 'Green' });
    await expect(greenRadio).toBeChecked();

    // Test Blue radio button
    const blueRadio = page.getByRole('radio', { name: 'Blue' });
    await expect(blueRadio).toBeVisible();
    await blueRadio.check();
    await expect(blueRadio).toBeChecked();

    // Test Yellow radio button
    const yellowRadio = page.getByRole('radio', { name: 'Yellow' });
    await expect(yellowRadio).toBeVisible();
    await yellowRadio.check();
    await expect(yellowRadio).toBeChecked();
  });

  test('select checkboxes - food items', async ({ page }) => {
    // Test Pasta checkbox using label filter
    const pastaLabel = page.locator('label').filter({ hasText: 'Pasta' });
    await expect(pastaLabel).toBeVisible();
    await pastaLabel.click();
    const pastaCheckbox = page.getByRole('checkbox', { name: 'Pasta' });
    await expect(pastaCheckbox).toBeChecked();

    // Test Pizza checkbox
    const pizzaCheckbox = page.getByRole('checkbox', { name: 'Pizza' });
    await expect(pizzaCheckbox).toBeVisible();
    await pizzaCheckbox.check();
    await expect(pizzaCheckbox).toBeChecked();

    // Test Burger checkbox using label filter
    const burgerLabel = page.locator('label').filter({ hasText: 'Burger' });
    await expect(burgerLabel).toBeVisible();
    await burgerLabel.click();
    const burgerCheckbox = page.getByRole('checkbox', { name: 'Burger' });
    await expect(burgerCheckbox).toBeChecked();

    // Test Sandwich checkbox
    const sandwichCheckbox = page.getByRole('checkbox', { name: 'Sandwich' });
    await expect(sandwichCheckbox).toBeVisible();
    await sandwichCheckbox.check();
    await expect(sandwichCheckbox).toBeChecked();
  });

  test('select country from dropdown', async ({ page }) => {
    const countrySelect = page.getByLabel('Select Country*');
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption('Bangladesh');
    await expect(countrySelect).toHaveValue('Bangladesh');
  });

  test('click submit button', async ({ page }) => {
    const submitButton = page.locator('form').getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
  });

  test('happy path - complete form submission', async ({ page }) => {
    // Fill all required text fields
    await page.getByRole('textbox', { name: 'Name*' }).fill('SQA Tester');
    await page.getByRole('textbox', { name: 'Email*' }).fill('sqa@tester.com');
    await page.getByRole('textbox', { name: 'Contact Number*' }).fill('01749884543');
    await page.getByRole('textbox', { name: 'Date' }).fill('2000-07-05');
    
    // Upload file (if the file exists)
    const uploadButton = page.getByRole('button', { name: 'Upload File*' });
    await uploadButton.setInputFiles('tests/assets/cat.jpg');
    
    // Select radio buttons (colors) - selecting one option as typically only one is allowed
    await page.getByRole('radio', { name: 'Red' }).check();
    
    // Select checkboxes (food items) - multiple selections allowed
    await page.locator('label').filter({ hasText: 'Pasta' }).click();
    await page.getByRole('checkbox', { name: 'Pizza' }).check();
    await page.locator('label').filter({ hasText: 'Burger' }).click();
    await page.getByRole('checkbox', { name: 'Sandwich' }).check();
    
    // Select country from dropdown
    await page.getByLabel('Select Country*').selectOption('Bangladesh');
    
    // Click submit button
    await page.locator('form').getByRole('button', { name: 'Submit' }).click();
    
    // Verify form submission success
    await expect(page.getByText('Form submit successfully.')).toBeVisible();
  });

  test('verify all required form elements are present', async ({ page }) => {
    // Verify all necessary form elements are visible
    await expect(page.getByRole('textbox', { name: 'Name*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Contact Number*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Date' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload File*' })).toBeVisible();
    
    // Verify color radio buttons
    await expect(page.getByRole('radio', { name: 'Red' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Green' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Blue' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Yellow' })).toBeVisible();
    
    // Verify food checkboxes
    await expect(page.getByRole('checkbox', { name: 'Pasta' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Pizza' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Burger' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Sandwich' })).toBeVisible();
    
    // Verify country dropdown
    await expect(page.getByLabel('Select Country*')).toBeVisible();
    
    // Verify submit button
    await expect(page.locator('form').getByRole('button', { name: 'Submit' })).toBeVisible();
  });

});