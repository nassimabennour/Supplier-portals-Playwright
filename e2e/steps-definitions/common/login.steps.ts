import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../pages/auth/LoginPage';
import { CookieConsent } from '../../pages/home/cookieConsent';
import { getCredentials } from '../../fixtures/users';
import { getLocators } from '../../locators/locators';

const { Given, When, Then } = createBdd();

Given('the super admin is on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
});

Given('the system admin is on the login page', async ({ page }) => {
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
    await loginPage.expectRedirectedAfterLogin();
});

Given('cookies are accepted if present', async ({ page }) => {
    const cookieConsent = new CookieConsent(page);
    await cookieConsent.acceptIfPresent();
});

Given('the super admin is logged in', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const user      = getCredentials(portal, 'superAdmin');
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.expectRedirectedAfterLogin();
    const cookieConsent = new CookieConsent(page);
    await cookieConsent.acceptIfPresent();
});

When('they log in with valid system admin credentials', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const user      = getCredentials(portal, 'systemAdmin');
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.login(user.email, user.password);
});

When('they log in with a wrong password', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const user      = getCredentials(portal, 'superAdmin');
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.login(user.email, 'WrongPassword123!');
});

When('they log in as system admin with a wrong password', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const user      = getCredentials(portal, 'systemAdmin');
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.login(user.email, 'WrongPassword123!');
});

When('they submit the login form without filling any field', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.submitEmptyForm();
});

When('they log in with an unknown email', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.login('unknown.user@gmail.com', 'SomePassword123!');
});

When('they enter an invalid email format', async ({ page, $testInfo }) => {
    const portal    = $testInfo.project.name;
    const locators  = getLocators(portal);
    const loginPage = new LoginPage(page, locators);

    await loginPage.enterInvalidEmailFormat('erer');
});

Then('they should see an invalid email format error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.expectInvalidEmailFormatError();
});

Then('they should see a login error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.expectLoginError();
});

Then('they should see a required field error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.expectRequiredFieldError();
});
