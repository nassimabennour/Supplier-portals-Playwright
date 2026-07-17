import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../pages/SupplierUserPage';
import { generateSupplierUser } from '../fixtures/supplierUser';

const { When, Then } = createBdd();

When('they create a new supplier user with valid details', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    const newUser = generateSupplierUser();

    await supplierUserPage.createSupplierUser(newUser);
});

Then('the supplier user should be created successfully', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.expectCreationSuccessful();
});
