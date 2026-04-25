import { test, expect } from '@playwright/test';
import { createTestUser, loginTestUser, deleteTestUser } from '../fixtures/user';

/**
 * G12 — learning.spec.ts
 * Critical journey: Dashboard → Click lesson → Submit answer → XP awarded → Progress page
 */
test.describe('Learning Flow', () => {
  test('complete a lesson and earn XP', async ({ page, request }) => {
    const user = await createTestUser(request);
    // Get token and set cookie/localStorage for pre-authenticated state
    const token = await loginTestUser(request, user);

    // Inject auth token via localStorage / cookie before navigation
    await page.goto('/');
    await page.evaluate((t) => {
      localStorage.setItem('token', t);
      localStorage.setItem('omnilingo_token', t);
    }, token);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/);

    // ── Find "Today's Mission" or first lesson CTA
    const lessonCTA = page.getByRole('link', { name: /start lesson|continue|tiếp tục/i }).first();
    const hasCTA = await lessonCTA.isVisible({ timeout: 10_000 }).catch(() => false);

    if (!hasCTA) {
      // Navigate to /learn page and pick any lesson
      await page.goto('/learn');
      await page.getByRole('link', { name: /lesson|unit/i }).first().click();
    } else {
      await lessonCTA.click();
    }

    // ── In the lesson, submit an answer
    await expect(page).toHaveURL(/lesson|exercise|learn/);

    // Wait for first exercise to load
    const answerBtn = page.getByRole('button', { name: /.+/ }).first();
    await expect(answerBtn).toBeVisible({ timeout: 15_000 });
    await answerBtn.click();

    // Submit answer
    const submitBtn = page.getByRole('button', { name: /submit|check|confirm/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // XP notification or score visible
    await expect(
      page.getByText(/xp|score|correct|great|well done/i).first()
    ).toBeVisible({ timeout: 15_000 });

    // ── Check progress page
    await page.goto('/progress');
    await expect(page).toHaveURL(/progress/);
    // Progress page should have some skill or stat visible
    await expect(page.getByRole('main')).toBeVisible();

    await deleteTestUser(request, user.email);
  });
});
