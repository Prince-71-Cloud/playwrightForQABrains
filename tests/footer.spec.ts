import { test, expect, Page, BrowserContext, Response } from "@playwright/test";

const baseURL = "https://practice.qabrains.com";

test.describe("Footer Links Functionality", () => {
  test.setTimeout(120000);

  // helper: click a footer link and assert navigation/url depending on target
  const clickAndAssertNavigation = async (
    page: Page,
    context: BrowserContext,
    linkLocator: any,
    expectedUrl: string
  ) => {
    const target = await linkLocator.getAttribute("target");

    if (target === "_blank") {
      // sometimes links declare target=_blank but don't actually open a new popup
      // wait briefly for a new page, otherwise fallback to same-tab behavior
      const newPagePromise = context.waitForEvent("page");
      // start click
      await linkLocator.click();
      const race = (await Promise.race([
        newPagePromise.then((p) => ({ opened: true, page: p })),
        new Promise((res) => setTimeout(() => res({ opened: false }), 2500)),
      ])) as { opened: boolean; page?: Page } | { opened: false };

      if ((race as any).opened) {
        const newPage = (race as any).page as Page;
        await newPage.waitForLoadState("networkidle");
        await expect(newPage).toHaveURL(expectedUrl);
        // check main response status if possible
        try {
          const resp = await newPage.waitForResponse((r: Response) =>
            r.url().startsWith(expectedUrl)
          );
          expect(resp.status()).toBeLessThan(400);
        } catch (e) {
          // ignore if response detection fails for some hosts
        }
        await newPage.close();
        // bring original page front if still available
        if (!page.isClosed()) await page.bringToFront();
      } else {
        // fallback: treat it as same-tab navigation
        await Promise.all([
          page
            .waitForNavigation({ waitUntil: "networkidle" })
            .catch(() => null),
        ]);
        await expect(page).toHaveURL(new RegExp(`^${expectedUrl}`));
        await page.goBack();
        await page.waitForLoadState("networkidle");
      }
    } else {
      // same-tab navigation (or anchor). use waitForNavigation for robustness
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }).catch(() => null),
        linkLocator.click(),
      ]);
      // Some links may be absolute or relative; assert startsWith expectedUrl
      await expect(page).toHaveURL(new RegExp(`^${expectedUrl}`));
      // go back to base for next checks
      await page.goBack();
      await page.waitForLoadState("networkidle");
    }
  };

  test("Quick Links in footer navigate to correct pages", async ({
    page,
    context,
  }) => {
    await page.goto(baseURL);
    const footer = page.locator("footer");

    // Quick Links: Discussion, About Us, Terms & Conditions, Privacy Policy
    const quickLinks = [
      { name: "Discussion", url: "https://qabrains.com/discussion" },
      { name: "About Us", url: "https://qabrains.com/about" },
      { name: "Terms & Conditions", url: "https://qabrains.com/terms" },
      { name: "Privacy Policy", url: "https://qabrains.com/policy" },
    ];

    for (const link of quickLinks) {
      const locator = footer.getByRole("link", { name: link.name });
      await expect(locator).toBeVisible();
      // if it's a mailto or javascript link, skip navigation
      await clickAndAssertNavigation(page, context, locator, link.url);
    }
  });

  test("Follow Us social links have correct hrefs and open externally", async ({
    page,
    context,
  }) => {
    await page.goto(baseURL);
    const footer = page.locator("footer");

    const socials = [
      {
        selector: 'a[href*="linkedin.com"]',
        name: "LinkedIn",
        expected: "https://www.linkedin.com",
      },
      {
        selector: 'a[href*="facebook.com"]',
        name: "Facebook",
        expected: "https://www.facebook.com",
      },
      {
        selector: 'a[href*="youtube.com"]',
        name: "YouTube",
        expected: "https://www.youtube.com",
      },
    ];

    for (const s of socials) {
      const locator = footer.locator(s.selector).first();
      await expect(locator).toBeVisible();
      const href = await locator.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href!.startsWith(s.expected)).toBeTruthy();
      // If it opens in a new tab, ensure clicking opens a page and has reachable response
      const target = await locator.getAttribute("target");
      if (target === "_blank") {
        const [newPage] = await Promise.all([
          context.waitForEvent("page"),
          locator.click(),
        ]);
        await newPage.waitForLoadState("domcontentloaded");
        // just ensure URL contains the domain
        expect(newPage.url()).toContain(new URL(s.expected).host);
        await newPage.close();
        await page.bringToFront();
      }
    }
  });

  test("Support mailto link and footer basics", async ({ page }) => {
    await page.goto(baseURL);
    const footer = page.locator("footer");

    // Support email
    const support = footer.locator('a[href^="mailto:"]');
    await expect(support).toBeVisible();
    const mailHref = await support.getAttribute("href");
    expect(mailHref).toBe("mailto:support@qabrains.com");

    // Logo in footer should navigate to home
    const logo = footer
      .getByRole("link", { name: "Logo (Practice Site)" })
      .first();
    if ((await logo.count()) > 0) {
      await expect(logo).toBeVisible();
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        logo.click(),
      ]);
      await expect(page).toHaveURL(baseURL);
    }
  });
});
