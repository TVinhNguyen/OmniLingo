import { test, expect } from '@playwright/test';
import { createTestUser, loginTestUser, deleteTestUser } from '../fixtures/user';

/**
 * G12 — billing.spec.ts
 * Critical journey: Pricing page → mock Stripe checkout → /settings/subscription active
 *
 * NOTE: In CI, Stripe is mocked via STRIPE_WEBHOOK_SECRET env + stripe CLI fixture.
 * For local runs, set MOCK_STRIPE=true to skip actual payment and simulate success.
 */
test.describe('Billing', () => {
  test('pricing page is accessible', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/OmniLingo/i);

    // At least one plan card visible
    await expect(
      page.getByText(/free|plus|premium|plan|month/i).first()
    ).toBeVisible();
  });

  test('upgrade to Plus plan (mock flow)', async ({ page, request }) => {
    // Skip if Stripe mock not configured
    test.skip(
      process.env.MOCK_STRIPE !== 'true',
      'Stripe mock not configured — set MOCK_STRIPE=true'
    );

    const user = await createTestUser(request);
    const token = await loginTestUser(request, user);

    await page.goto('/');
    await page.evaluate((t) => {
      localStorage.setItem('token', t);
      localStorage.setItem('omnilingo_token', t);
    }, token);

    // ── Navigate to pricing
    await page.goto('/pricing');

    // ── Click upgrade on the Plus plan
    const upgradeBtn = page.getByRole('button', { name: /upgrade|get plus|subscribe/i }).first();
    await upgradeBtn.click();

    // In mock mode, Stripe checkout redirect is intercepted and returns success
    // The app should handle the success callback and redirect to settings
    await expect(page).toHaveURL(/settings.*subscription|subscription.*success/, { timeout: 30_000 });

    // ── Verify subscription shows active
    await page.goto('/settings/subscription');
    await expect(
      page.getByText(/active|plus|subscribed|your plan/i).first()
    ).toBeVisible({ timeout: 10_000 });

    await deleteTestUser(request, user.email);
  });
});
