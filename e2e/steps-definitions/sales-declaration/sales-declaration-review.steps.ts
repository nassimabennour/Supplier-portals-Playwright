import { Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../pages/auth/LoginPage';
import { CookieConsent } from '../../pages/home/cookieConsent';
import { SalesDeclarationUserPage } from '../../pages/sales-declaration/SalesDeclarationUserPage';
import { SalesDeclarationListPage } from '../../pages/sales-declaration/SalesDeclarationListPage';
import { SalesDeclarationDetailPage } from '../../pages/sales-declaration/SalesDeclarationDetailPage';
import { getCredentials } from '../../fixtures/users';
import { getLocators } from '../../locators/locators';
import { SALES_DECLARATION_FILE_PATH, getCurrentCampaignName } from '../../fixtures/salesDeclaration';

const { Given, When, Then } = createBdd();

// A separate browser context, not just a different login — mirrors two
// real people acting on the same document.
let supplierUserPage: Page;

Given('the supplier user is logged in', async ({ page, $testInfo }) => {
    // Close the previous scenario's context — @mode:serial means this step
    // can run more than once in the same worker.
    if (supplierUserPage) {
        await supplierUserPage.context().close();
    }

    const portal = $testInfo.project.name;
    const context = await page.context().browser()!.newContext();
    supplierUserPage = await context.newPage();

    const user = getCredentials(portal, 'supplierUser');
    const locators = getLocators(portal);
    const loginPage = new LoginPage(supplierUserPage, locators);

    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.expectRedirectedAfterLogin();
    await new CookieConsent(supplierUserPage).acceptIfPresent();
});

When('the supplier user opens the sales declaration', async () => {
    const userPage = new SalesDeclarationUserPage(supplierUserPage);
    await userPage.goToSalesDeclarations();
});

When('the supplier user downloads the declaration', async () => {
    const userPage = new SalesDeclarationUserPage(supplierUserPage);
    await userPage.downloadCurrentDeclaration();
});

When('the supplier user re-uploads the corrected file', async () => {
    const userPage = new SalesDeclarationUserPage(supplierUserPage);
    await userPage.reuploadFile(SALES_DECLARATION_FILE_PATH);
});

When('the super admin opens the declaration from the list', async ({ page }) => {
    // A plain reload isn't enough — it lands back on the stale detail page.
    // Go to Home instead since that's what goToManageSalesDeclaration() expects.
    await page.goto('/home');

    const listPage = new SalesDeclarationListPage(page);
    await listPage.openDeclarationByCampaign(getCurrentCampaignName());
});

When('the super admin downloads the re-uploaded file', async ({ page }) => {
    const detailPage = new SalesDeclarationDetailPage(page);
    await detailPage.downloadReuploadedFile();
});

When('the super admin validates the declaration with a note {string}', async ({ page }, note: string) => {
    const detailPage = new SalesDeclarationDetailPage(page);
    await detailPage.validateWithNote(note);
});

Then('the sales declaration is validated', async ({ page }) => {
    const detailPage = new SalesDeclarationDetailPage(page);
    await detailPage.expectValidated();
});

Then('the supplier user can download it from their old validated declarations', async () => {
    const userPage = new SalesDeclarationUserPage(supplierUserPage);
    await userPage.downloadFromOldValidatedDeclarations(getCurrentCampaignName());
});

When('the super admin rejects the declaration with a note {string}', async ({ page }, note: string) => {
    const detailPage = new SalesDeclarationDetailPage(page);
    await detailPage.rejectWithNote(note);
});

Then('the sales declaration is rejected', async ({ page }) => {
    const detailPage = new SalesDeclarationDetailPage(page);
    await detailPage.expectRejected();
});
