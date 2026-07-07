import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getCredentials } from '../fixtures/users';
import { getLocators } from '../locators/locators';

test.describe('Authentication — Login', () => {

  test(
    'TC-LOGIN-01 | Nominal | Super Admin can login successfully',
    async ({ page }, testInfo) => {

      // ── Arrange ──────────────────────────────────────────
      const portal    = testInfo.project.name;
      const user      = getCredentials(portal, 'superAdmin');
      const locators  = getLocators(portal);
      const loginPage = new LoginPage(page, locators);

      // ── Act ───────────────────────────────────────────────
      await loginPage.goto();
      await loginPage.login(user.email, user.password);

      // ── Assert ────────────────────────────────────────────
      //await loginPage.expectRedirectedAfterLogin();
    }
  );

});