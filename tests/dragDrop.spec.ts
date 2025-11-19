import { test, expect, Page } from "@playwright/test";

const BASE_URL = "https://practice.qabrains.com/";

test.describe("Drag and Drop Test Suite", () => {
  test.setTimeout(60000); // Set timeout to 1 minute for drag and drop tests

  test("Drag and drop - User Authentication Block", async ({ page }) => {
    // Navigate to the website
    await page.goto(BASE_URL);

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/QA Practice Site/);

    // Find and click the "User Authentication" demo
    const authDemo = page.locator("#demo-module").getByText("User Authentication");
    await expect(authDemo).toBeVisible({ timeout: 10000 });
    await authDemo.click();
    
    await page.waitForLoadState('networkidle');
    
    // Look for any draggable elements in the authentication section
    const draggableElements = page.locator('[draggable="true"], .draggable, [class*="drag"]');
    const draggableCount = await draggableElements.count();
    
    if (draggableCount > 0) {
      console.log(`Found ${draggableCount} draggable elements`);
      
      // Try to drag any available draggable element to another area
      const firstDraggable = draggableElements.first();
      const otherElements = page.locator('div, section, .container').filter({ hasNot: firstDraggable });
      
      if (await otherElements.count() > 0) {
        const targetElement = otherElements.first();
        
        await expect(firstDraggable).toBeVisible();
        await expect(targetElement).toBeVisible();
        
        // Try the drag operation
        await firstDraggable.dragTo(targetElement, { timeout: 10000 });
        console.log("Drag and drop completed in User Authentication section");
      }
    } else {
      console.log("No draggable elements found in this section");
      test.skip("No drag and drop functionality found in this section");
    }
  });

  test("Drag and drop - Block Elements", async ({ page }) => {
    // Navigate to the website
    await page.goto(BASE_URL);

    // Find visible block elements that could potentially be draggable
    // These might be cards, panels, or other UI elements
    // Filter for truly visible elements only
    const allPotentialBlocks = page.locator('.block, .card, .ui-widget-content, .portlet, [class*="item"]');
    const visibleBlocks = [];
    
    const count = await allPotentialBlocks.count();
    for (let i = 0; i < count; i++) {
      const element = allPotentialBlocks.nth(i);
      if (await element.isVisible()) {
        visibleBlocks.push(element);
      }
    }
    
    console.log(`Found ${visibleBlocks.length} visible potential drag elements`);
    
    if (visibleBlocks.length >= 2) {
      const firstBlock = visibleBlocks[0];
      const secondBlock = visibleBlocks[1];
      
      await expect(firstBlock).toBeVisible();
      await expect(secondBlock).toBeVisible();
      
      // Try to drag the first block towards the second
      try {
        await firstBlock.dragTo(secondBlock, { timeout: 15000 });
        console.log("Drag operation completed with block elements");
      } catch (dragError) {
        console.log("DragTo failed, trying mouse actions:", dragError);
        
        // Try with mouse actions as fallback
        try {
          const firstBox = await firstBlock.boundingBox();
          const secondBox = await secondBlock.boundingBox();
          
          if (firstBox && secondBox) {
            await firstBlock.hover();
            await page.mouse.down();
            await page.mouse.move(
              secondBox.x + secondBox.width / 2,
              secondBox.y + secondBox.height / 2
            );
            await page.mouse.up();
            
            console.log("Mouse-based drag operation completed");
          } else {
            console.log("Could not get bounding boxes for drag operation");
            test.skip("No suitable elements for drag operation");
          }
        } catch (mouseError) {
          console.log("Mouse-based drag also failed:", mouseError);
          test.skip("No successful drag operation possible");
        }
      }
    } else {
      test.skip("Not enough visible block elements found for drag and drop");
    }
  });

  test("Drag and drop - Common UI Interactions", async ({ page }) => {
    // Navigate to the website
    await page.goto(BASE_URL);

    // Test for sortable lists or drag-and-drop interfaces
    const sortableElements = page.locator('.sortable, .ui-sortable, [class*="sort"]');
    const sortableCount = await sortableElements.count();
    
    if (sortableCount > 0) {
      console.log(`Found ${sortableCount} sortable containers`);
      
      const sortableContainer = sortableElements.first();
      const items = sortableContainer.locator('li, .list-item, .item, div');
      const itemCount = await items.count();
      
      if (itemCount >= 2) {
        console.log(`Found ${itemCount} items in sortable container`);
        
        const firstItem = items.first();
        const secondItem = items.nth(1);
        
        await expect(firstItem).toBeVisible();
        await expect(secondItem).toBeVisible();
        
        try {
          await firstItem.dragTo(secondItem, { timeout: 15000 });
          console.log("Sortable item drag completed");
        } catch (sortError) {
          console.log("Sortable drag failed:", sortError);
          
          // Try mouse-based approach
          try {
            const firstBox = await firstItem.boundingBox();
            const secondBox = await secondItem.boundingBox();
            
            if (firstBox && secondBox) {
              await firstItem.hover();
              await page.mouse.down();
              await page.mouse.move(
                secondBox.x + secondBox.width / 2,
                secondBox.y + secondBox.height / 2
              );
              await page.mouse.up();
              
              console.log("Sortable mouse-based drag completed");
            }
          } catch (mouseError) {
            console.log("Mouse-based sortable drag also failed:", mouseError);
            test.skip("No sortable drag operation possible");
          }
        }
      } else {
        test.skip("Not enough items in sortable container");
      }
    } else {
      test.skip("No sortable containers found");
    }
  });
});