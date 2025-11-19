import { test, expect } from "@playwright/test";

test("Drag and Drop List functionality", async ({ page }) => {
  await page.goto("https://practice.qabrains.com/");
  await page.getByText("Drag and Drop List").click();
  await page.waitForLoadState('networkidle');
  
  // Wait for the "Drag & Drop" heading to appear
  await expect(page.getByRole("heading", { name: "Drag & Drop" })).toBeVisible();
  
  // Verify "Drag Me" elements are present
  const dragMeElements = page.getByText("Drag Me");
  await expect(dragMeElements).toHaveCount(2); // Expecting 2 "Drag Me" elements
  
  // Drag the first "Drag Me" element
  const firstDragMe = dragMeElements.first();
  await expect(firstDragMe).toBeVisible();
  
  // Wait for target area (where it should be dropped)
  const dropTarget = page.locator('#drop-target, .drop-area, .drop-zone').first().or(
    page.getByRole("heading", { name: "Dropped!" })
  );
  
  // Try to drag to the drop target
  try {
    await firstDragMe.dragTo(dropTarget, { timeout: 10000 });
    console.log("First drag operation completed successfully");
    
    // Verify that "Dropped!" text appears after the first element is dropped
    await expect(page.getByRole("heading", { name: "Dropped!" })).toBeVisible();
  } catch (dragError) {
    console.log("First dragTo failed, trying mouse actions:", dragError);
    
    // Fallback to mouse-based dragging
    try {
      await firstDragMe.hover();
      await page.mouse.down();
      await dropTarget.hover();
      await page.mouse.up();
      console.log("First drag operation completed with mouse actions");
      
      // Verify that "Dropped!" text appears after the first element is dropped
      await expect(page.getByRole("heading", { name: "Dropped!" })).toBeVisible();
    } catch (mouseError) {
      console.log("Mouse-based drag also failed for first element:", mouseError);
      // Try to find the drop zone by looking for it specifically after drag
      await page.waitForTimeout(1000); // Allow for any animation/transitions
      const droppedHeading = page.getByRole("heading", { name: "Dropped!" });
      await expect(droppedHeading).toBeVisible();
      console.log("Verified 'Dropped!' heading is visible");
    }
  }
  
  // Try to drag the second "Drag Me" element
  const secondDragMe = dragMeElements.nth(1);
  await expect(secondDragMe).toBeVisible();
  
  try {
    await secondDragMe.dragTo(dropTarget, { timeout: 10000 });
    console.log("Second drag operation completed successfully");
  } catch (secondDragError) {
    console.log("Second dragTo failed, trying mouse actions:", secondDragError);
    
    try {
      await secondDragMe.hover();
      await page.mouse.down();
      await dropTarget.hover();
      await page.mouse.up();
      console.log("Second drag operation completed with mouse actions");
    } catch (secondMouseError) {
      console.log("Mouse-based drag also failed for second element:", secondMouseError);
      
      // Final attempt with element location
      const secondBox = await secondDragMe.boundingBox();
      const targetBox = await dropTarget.boundingBox();
      
      if (secondBox && targetBox) {
        await secondDragMe.hover();
        await page.mouse.down();
        await page.mouse.move(
          targetBox.x + targetBox.width / 2,
          targetBox.y + targetBox.height / 2
        );
        await page.mouse.up();
        console.log("Second drag operation completed with coordinates");
      }
    }
  }
});