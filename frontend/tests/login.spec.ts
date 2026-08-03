import { test, expect } from '@playwright/test';

test('User can log in and see the dashboard', async ({ page }) => {
  // Go to the login page (root redirects to login or handles login)
  await page.goto('/');

  // Look for the login elements based on the frontend structure.
  // Wait for the login button or input fields to appear
  const usernameInput = page.getByPlaceholder('Enter username');
  const passwordInput = page.getByPlaceholder('••••••••');
  
  await expect(usernameInput).toBeVisible();
  
  await usernameInput.fill('super_admin');
  await passwordInput.fill('password123');

  // Click the sign-in button
  await page.getByRole('button', { name: 'Sign In to Portal' }).click();

  // Verify successful redirect or dashboard elements
  await expect(page.getByText('Director Robert Chen').first()).toBeVisible({ timeout: 10000 });
});
