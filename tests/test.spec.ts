import { test, expect, type Page, type BrowserContext } from '@playwright/test';

test.describe('QA Brains Website Complete Navigation Test', () => {
  test.setTimeout(60000);

  test('verify all navigation links and buttons functionality', async ({ page, context }) => {
    // Helper: Close popup and return to main page
    const closePopupAndSwitchBack = async (popupPage: Page | null) => {
      if (popupPage && !popupPage.isClosed()) {
        await popupPage.close();
      }
      await page.bringToFront(); // Ensure focus is back
    };

    // === 1. Navigate to the website ===
    await page.goto('https://practice.qabrains.com/');
    await expect(page).toHaveTitle(/QA Practice Site/i);
    await expect(page.getByRole('heading', { name: 'QA Practice Site' })).toBeVisible();

    // === 2. Logo Link (stays on same page) ===
    const logoLink = page.getByRole('link', { name: 'Logo (Practice Site)' });
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    await expect(page).toHaveURL('https://practice.qabrains.com/');

    // === 3. Home Link (stays on same page) ===
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://practice.qabrains.com/');

    // === 4. QA Topics Link → Opens in NEW TAB ===
    const navContainer = page.locator('header'); // or 'nav', '#nav', etc.
    const qaTopicsLink = navContainer.getByRole('link', { name: 'QA Topics' });

    await expect(qaTopicsLink).toBeVisible();

    const [qaTopicsPage] = await Promise.all([
      context.waitForEvent('page'), // Correct: use context
      qaTopicsLink.click(),
    ]);

    await qaTopicsPage.waitForLoadState('networkidle');
    await expect(qaTopicsPage).toHaveURL('https://qabrains.com/topics');
    await closePopupAndSwitchBack(qaTopicsPage);

    // === 5. Discussion Link → Opens in NEW TAB (Fix: Avoid duplicate in footer) ===
    const discussionLink = navContainer.getByRole('link', { name: 'Discussion' });

    await expect(discussionLink).toBeVisible(); // Now only 1 match → no strict mode error

    const [discussionPage] = await Promise.all([
      context.waitForEvent('page'),
      discussionLink.click(),
    ]);

    await discussionPage.waitForLoadState('networkidle');
    await expect(discussionPage).toHaveURL('https://qabrains.com/discussion');
    await closePopupAndSwitchBack(discussionPage);

    // === 6. Final Verification: Back on main page ===
    await expect(page).toHaveURL('https://practice.qabrains.com/');
    await expect(page.getByRole('heading', { name: 'QA Practice Site' })).toBeVisible();
  });
});