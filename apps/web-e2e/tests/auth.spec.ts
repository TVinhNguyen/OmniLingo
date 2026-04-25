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
    await page.goto('/register');
    await expect(page).toHaveTitle(/OmniLingo/i);

    await page.getByLabel(/name/i).fill(user.name);
    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/^password/i).fill(user.password);
    await page.getByRole('button', { name: /create account|sign up|register/i }).click();

    // Should redirect to dashboard or onboarding after successful register
    await expect(page).toHaveURL(/dashboard|onboarding/);

    await deleteTestUser(request, user.email);
  });

  test('login with valid credentials', async ({ page, request }) => {
    const user = await createTestUser(request);

    // ── Login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/password/i).fill(user.password);
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();

    // Authenticated user lands on dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('navigation')).toBeVisible();

    // ── Logout
    await page.getByRole('button', { name: /log out|sign out|logout/i }).click();
    await expect(page).toHaveURL(/login|\/$/);

    await deleteTestUser(request, user.email);
  });

  test('login with wrong password returns error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('nonexistent@omnilingo-test.local');
    await page.getByLabel(/password/i).fill('WrongPassword1!');
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();

    // Should show an error message — not redirect
    await expect(page.getByText(/invalid|incorrect|wrong|error/i)).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });
});
