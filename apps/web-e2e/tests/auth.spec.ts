import { test, expect } from '@playwright/test';
import { buildTestUser, createTestUser, deleteTestUser } from '../fixtures/user';

/**
 * G12 — auth.spec.ts
 * Critical journey: Register → Login → Logout
 */
test.describe('Authentication', () => {
  test('register and login flow', async ({ page, request }) => {
    const user = buildTestUser();

    // ── Register via UI (not pre-registered via API)
    await page.goto('/sign-up');
    await expect(page).toHaveTitle(/OmniLingo/i);

    await page.locator('input[name="displayName"]').fill(user.name);
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.locator('#terms').check();
    await page.getByRole('button', { name: /tạo tài khoản|create account|sign up|register/i }).click();

    // Should redirect to dashboard or onboarding after successful register
    await expect(page).toHaveURL(/dashboard|onboarding/);

    await deleteTestUser(request, user.email);
  });

  test('login with valid credentials', async ({ page, request }) => {
    const user = await createTestUser(request);

    // ── Login
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.getByRole('button', { name: /đăng nhập|sign in|log in|login/i }).click();

    // Authenticated user lands on dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('navigation')).toBeVisible();

    await deleteTestUser(request, user.email);
  });

  test('login with wrong password returns error', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="email"]').fill('nonexistent@omnilingo-test.local');
    await page.locator('input[name="password"]').fill('WrongPassword1!');
    await page.getByRole('button', { name: /đăng nhập|sign in|log in|login/i }).click();

    // Should show an error message — not redirect
    await expect(page.getByText(/không đúng|thất bại|invalid|incorrect|wrong|error/i)).toBeVisible();
    await expect(page).toHaveURL(/sign-in/);
  });
});
