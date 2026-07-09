import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { getCredentials } from '../fixtures/users';
import { getLocators } from '../locators/locators';

const { Given, When, Then } = createBdd();

Given('the super admin is on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(); 
});

When('they log in with valid credentials', async ({ page, $testInfo }) => {
      const portal    = $testInfo.project.name;
      const user      = getCredentials(portal, 'superAdmin');
      const locators  = getLocators(portal);
      const loginPage = new LoginPage(page, locators);

      await loginPage.login(user.email, user.password);
});

Then('they should be redirected after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    //await loginPage.expectRedirectedAfterLogin(); 
});
