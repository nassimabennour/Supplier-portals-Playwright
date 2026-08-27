import { createBdd } from 'playwright-bdd';
import { SalesDeclarationListPage } from '../../pages/sales-declaration/SalesDeclarationListPage';
import { SalesDeclarationCreatePage } from '../../pages/sales-declaration/SalesDeclarationCreatePage';
import { SalesDeclarationDetailPage } from '../../pages/sales-declaration/SalesDeclarationDetailPage';
import {
    SALES_DECLARATION_PORTAL,
    SALES_DECLARATION_FILE_PATH,
    SALES_DECLARATION_FILE_TITLE,
    INVALID_FILE_TYPE_PATH,
    OVERSIZED_FILE_PATH,
    generateCampaignName,
    setCurrentCampaignName,
} from '../../fixtures/salesDeclaration';

const { Given, When, Then } = createBdd();

Given('the sales declaration feature is only available on R3S', async ({ $testInfo }) => {
    $testInfo.skip(
        $testInfo.project.name !== SALES_DECLARATION_PORTAL,
        `Sales declaration is only exposed on ${SALES_DECLARATION_PORTAL} — skipping on ${$testInfo.project.name}.`
    );
});

Given('the super admin opens the sales declaration creation page', async ({ page }) => {
    const listPage = new SalesDeclarationListPage(page);
    await listPage.goToCreatePage();
});

When('the super admin uploads a sales declaration file', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.uploadFile(SALES_DECLARATION_FILE_PATH);
});

When('the super admin selects the supplier {string}', async ({ page }, supplierName: string) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.selectSupplier(supplierName);
});

When('the super admin selects the user {string}', async ({ page }, userName: string) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.selectUser(userName);
});

When('the super admin sets a new campaign name', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    const campaignName = generateCampaignName();
    setCurrentCampaignName(campaignName);
    await createPage.fillCampaignName(campaignName);
});

When('the super admin sets a reminder date', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.setReminderDate();
});

When('the super admin confirms the sales declaration creation', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.submit();
});

Then('the sales declaration document is created successfully', async ({ page }) => {
    const detailPage = new SalesDeclarationDetailPage(page);
    await detailPage.expectDocumentCreated(SALES_DECLARATION_FILE_TITLE);
});

When('the super admin cancels the sales declaration creation', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.cancel();
});

Then('the super admin returns to the sales declaration list', async ({ page }) => {
    const listPage = new SalesDeclarationListPage(page);
    await listPage.expectOnListPage();
});

When('the super admin uploads a file of an unsupported type', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.uploadFile(INVALID_FILE_TYPE_PATH);
});

When('the super admin uploads a file exceeding the size limit', async ({ page }) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.uploadFile(OVERSIZED_FILE_PATH);
});

Then('the file is rejected with the message {string}', async ({ page }, message: string) => {
    const createPage = new SalesDeclarationCreatePage(page);
    await createPage.expectFileRejected(message);
});
