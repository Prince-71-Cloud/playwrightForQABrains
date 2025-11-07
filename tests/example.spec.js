import { test, expect } from '@playwright/test';

test.describe('QA Brains Website Complete Navigation Test', () => {
    test.setTimeout(60000);

test('verify all navigation links and buttons functionality', async ({ page }) => {
    // helper to close a popup/new tab and switch back to the main page
     const closePopupAndSwitchBack = async (popupPage) => {
      if (popupPage && !popupPage.isClosed()) {
        await popupPage.close();
      }
      await page.bringToFront(); // Ensure focus is back
    };
    // Navigate to the website
    await page.goto('https://practice.qabrains.com/');

        // Verify page title and main heading
        await expect(page).toHaveTitle('QA Practice Site');
        const heading = page.getByRole('heading', { name: 'QA Practice Site' });
        await expect(heading).toBeVisible();

        // Test internal navigation links
        const logoLink = page.getByRole('link', { name: 'Logo (Practice Site)' });
        await expect(logoLink).toBeVisible();
        await logoLink.click();
        await expect(page).toHaveURL('https://practice.qabrains.com');

        // Test home link
        const homeLink = page.getByRole('link', { name: 'Home' });
        await expect(homeLink).toBeVisible();
        await homeLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('https://practice.qabrains.com');

        // Test User Authentication menu items

        // Click QA Topics heading and handle new tab
        const qaTopicsLink = page.getByRole('link', { name: 'QA Topics' });
        await page.waitForLoadState('networkidle');
        await qaTopicsLink.click();
        await page.waitForLoadState('networkidle');
        await expect(popupPage).toHaveURL('https://qabrains.com/topics');
        // Close the new tab and switch back to the original tab (main page)
        await closePopupAndSwitchBack(popupPage);


        // Click Discussion heading and handle new tab
        const discussionLink = page.getByRole('link', { name: 'Discussion' });
        await expect(discussionLink).toBeVisible();
        await discussionLink.click();
        await page.waitForLoadState('networkidle');
        // Wait for the new page to load and verify URL
        await newDiscussionPage.waitForLoadState('networkidle');
        await expect(newDiscussionPage).toHaveURL('https://qabrains.com/discussion');
        await newDiscussionPage.goBack();

        // // Click Tags heading and handle new tab    
        // const tagsLink = page.getByRole('link', { name: 'Tags' });
        // await expect(tagsLink).toBeVisible();
        // const [newTagsPage] = await Promise.all([
        //     page.waitForEvent('popup'),
        //     tagsLink.click()
        // ]);
        // // Wait for the new page to load and verify URL
        // await newTagsPage.waitForLoadState('networkidle');
        // await expect(newTagsPage).toHaveURL('https://qabrains.com/tags');
        // await newTagsPage.goBack();

        // // Click Discussion heading and handle new tab
        // const jobsLink = page.getByRole('link', { name: 'Jobs' });
        // await expect(jobsLink).toBeVisible();
        // const [newJobsPage] = await Promise.all([
        //     page.waitForEvent('popup'),
        //     jobsLink.click()
        // ]);
        // // Wait for the new page to load and verify URL
        // await newJobsPage.waitForLoadState('networkidle');
        // await expect(newJobsPage).toHaveURL('https://qabrains.com/jobs');
        // await newJobsPage.goBack();

        // // Click Practice Site heading and handle new tab    
        // const practiceSiteLink = page.getByRole('link', { name: 'Practice Site' });
        // await expect(practiceSiteLink).toBeVisible();
        // const [newPracticeSitePage] = await Promise.all([
        //     page.waitForEvent('popup'),
        //     practiceSiteLink.click()
        // ]);
        // // Wait for the new page to load and verify URL
        // await newPracticeSitePage.waitForLoadState('networkidle');
        // await expect(newPracticeSitePage).toHaveURL('https://qabrains.com/practice-site');
        // await newPracticeSitePage.goBack();

        // await expect(userAuthMenuItem).toBeVisible();
        // await userAuthMenuItem.click();

        // const loginMenuItem = page.getByRole('menuitem', { name: 'Sign In' });
        // await expect(loginMenuItem).toBeVisible();
        // await loginMenuItem.click();

        // // Test login form
        // const emailInput = page.getByRole('textbox', { name: 'Email*' });
        // const passwordInput = page.getByRole('textbox', { name: 'Password*' });
        // const loginButton = page.getByRole('button', { name: 'Sign In' });

        // await expect(emailInput).toBeVisible();
        // await expect(passwordInput).toBeVisible();
        // await expect(loginButton).toBeVisible();

        // // Fill login form
        // await emailInput.fill('qa_testers@qabrains.com');
        // await passwordInput.fill('Password123');
        // await loginButton.click();

        // // Test navigation links that open in new tabs
        // const navLinks = [
        //     { name: 'QA Topics', url: 'https://qabrains.com/topics' },
        //     { name: 'Discussion', url: 'https://qabrains.com/discussion' },
        //     { name: 'Tags', url: 'https://qabrains.com/tags' },
        //     { name: 'Jobs', url: 'https://qabrains.com/jobs' },
        //     { name: 'Practice Site', url: 'https://qabrains.com/practice-site', exact: true },
        //     { name: 'About Us', url: 'https://qabrains.com/about' }
        // ];

        // for (const link of navLinks) {
        //     const linkElement = link.exact ? 
        //         page.getByRole('link', { name: link.name, exact: true }) :
        //         page.getByRole('link', { name: link.name });

        //     await expect(linkElement).toBeVisible();

        //     // Handle new tab
        //     const [newPage] = await Promise.all([
        //         page.waitForEvent('popup'),
        //         linkElement.click()
        //     ]);

        //     await newPage.waitForLoadState('networkidle');
        //     await expect(newPage).toHaveURL(link.url);
        //     await newPage.close();
        // }

        // // Test Form Submission menu item
        // const formSubmissionItem = page.getByRole('menuitem', { name: 'Form Submission' });
        // await expect(formSubmissionItem).toBeVisible();
        // await formSubmissionItem.click();

        // // Test Drag and Drop List menu item
        // const dragDropItem = page.getByRole('menuitem', { name: 'Drag and Drop List' });
        // await expect(dragDropItem).toBeVisible();
        // await dragDropItem.click();

        // // Test feedback section
        // const feedbackHeading = page.getByRole('heading', { name: 'Leave Feedback' });
        // await expect(feedbackHeading).toBeVisible();

        // const feedbackTextbox = page.getByRole('textbox', { name: 'Write Comment...' });
        // await expect(feedbackTextbox).toBeVisible();

        // const submitButton = page.getByRole('button', { name: 'Submit' });
        // await expect(submitButton).toBeDisabled(); // Submit should be disabled when textarea is empty

        // // Test footer links
        // const footerLinks = [
        //     { name: 'Discussion', url: 'https://qabrains.com/discussion' },
        //     { name: 'About Us', url: 'https://qabrains.com/about' },
        //     { name: 'Terms & Conditions', url: 'https://qabrains.com/terms' },
        //     { name: 'Privacy Policy', url: 'https://qabrains.com/policy' }
        // ];

        // for (const link of footerLinks) {
        //     const footerLink = page.getByRole('link', { name: link.name }).last();
        //     await expect(footerLink).toBeVisible();
        // }

        // // Verify social media links
        // const socialLinks = [
        //     { selector: 'img[alt="linkedin"]', url: 'https://www.linkedin.com/showcase/qabrainscom' },
        //     { selector: 'img[alt="facebook"]', url: 'https://www.facebook.com/qabrainscom' },
        //     { selector: 'img[alt="youtube"]', url: 'https://www.youtube.com/@QABrains' }
        // ];

        // for (const social of socialLinks) {
        //     const socialLink = page.locator(social.selector);
        //     await expect(socialLink).toBeVisible();
        // }

        // // Verify copyright text
        // const copyrightText = page.getByText('© 2025 QA Brains | All Rights Reserved');
        // await expect(copyrightText).toBeVisible();
    });
});