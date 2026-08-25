import { expect, test } from '@playwright/test';

test('opens the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Reelvio/);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('#dashboard-title')).toBeVisible();
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

test('navigates through the main pages', async ({ page }) => {
  await page.goto('/quiz');
  const navigation = page.getByRole('navigation', {
    name: /menu de navegação principal/i
  });

  await navigation.getByRole('link', { name: /trailers/i }).click();
  await expect(page).toHaveURL(/\/trailers$/);
  await expect(page.locator('#trailers-title')).toBeVisible();

  await navigation.getByRole('link', { name: /quiz/i }).click();
  await expect(page).toHaveURL(/\/quiz$/);
  await expect(page.locator('#quiz-title')).toBeVisible();

  await navigation.getByRole('link', { name: /minha lista/i }).click();
  await expect(page).toHaveURL(/\/watchlist$/);
  await expect(page.locator('#watchlist-title')).toBeVisible();
});

test('toggles the visual theme', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('reelvio_theme');
    localStorage.removeItem('cinerank_theme');
    localStorage.removeItem('theme');
  });
  await page.goto('/quiz');

  const themeButton = page.getByRole('button', {
    name: /alternar modo de cor/i
  });
  await expect(page.locator('body')).not.toHaveClass(/light-mode/);

  await themeButton.click();

  await expect(page.locator('body')).toHaveClass(/light-mode/);
  await expect(themeButton).toHaveAttribute('aria-pressed', 'true');
});
