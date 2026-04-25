import { test, expect } from '@playwright/test';
import { generateTestUser, deleteTestUser } from '../fixtures/user';

/**
 * G12 — onboarding.spec.ts
 * Critical journey: Register → 5-step Onboarding → Dashboard with enrolled track
 */
test.describe('Onboarding', () => {
  test('complete 5-step onboarding flow', async ({ page, request }) => {
    test.skip(
      !process.env.E2E_FULL_STACK,
      'Full onboarding requires web-bff and learning services'
    );

    const user = generateTestUser();

    // ── Register via UI (not pre-registered via API)
    await page.goto('/sign-up');
    await page.locator('input[name="displayName"]').fill(user.name);
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.locator('#terms').check();
    await page.getByRole('button', { name: /tạo tài khoản|create account|sign up|register/i }).click();

    // Should land on onboarding
    await expect(page).toHaveURL(/onboarding/);

    // ── Step 1: Select language to learn
    const langButton = page.getByRole('button', { name: /english|japanese|chinese|korean/i }).first();
    await langButton.click();
    await page.getByRole('button', { name: /next|continue/i }).click();

    // ── Step 2: Current level
    const levelButton = page.getByRole('button', { name: /beginner|a1|a2|absolute/i }).first();
    await levelButton.click();
    await page.getByRole('button', { name: /next|continue/i }).click();

    // ── Step 3: Goal / motivation
    const goalButton = page.getByRole('button', { name: /travel|work|certificate|fun/i }).first();
    await goalButton.click();
    await page.getByRole('button', { name: /next|continue/i }).click();

    // ── Step 4: Daily goal
    const goalMinButton = page.getByRole('button', { name: /10|15|20|30/i }).first();
    await goalMinButton.click();
    await page.getByRole('button', { name: /next|continue/i }).click();

    // ── Step 5: Certification (optional)
    // May not exist — skip if not visible
    const hasCertStep = await page.getByRole('button', { name: /ielts|toeic|skip/i }).isVisible().catch(() => false);
    if (hasCertStep) {
      await page.getByRole('button', { name: /skip|maybe later/i }).first().click();
    }

    // Complete onboarding
    const startBtn = page.getByRole('button', { name: /start|get started|finish|go to dashboard/i });
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // ── Should reach dashboard with an enrolled track
    await expect(page).toHaveURL(/dashboard/);
    // At least a "Today's Mission" or "Track" widget should be present
    await expect(
      page.getByText(/today.?s mission|continue learning|enrolled|track/i).first()
    ).toBeVisible({ timeout: 15_000 });

    await deleteTestUser(request, user.email);
  });
});
