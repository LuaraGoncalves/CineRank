import { expect, test } from '@playwright/test';

test('opens the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/CineRank/);
  await expect(page.getByRole('main')).toBeVisible();
});

test('opens the quiz page', async ({ page }) => {
  await page.goto('/quiz');

  await expect(
    page.getByRole('heading', { name: /quiz de filmes e séries/i })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /começar quiz/i })
  ).toBeVisible();
});
