import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../pages/SupplierUserPage';
import { generateSupplierUser } from '../fixtures/supplierUser';

const { When, Then } = createBdd();

When('they create a new supplier user with valid details', async ({ page, $testInfo }) => {
    const portal = $testInfo.project.name;
    const supplierUserPage = new SupplierUserPage(page);
    const newUser = generateSupplierUser(portal);

    await supplierUserPage.createSupplierUser(newUser);
});

Then('the supplier user should be created successfully', async ({ page, $testInfo }) => {
    const portal = $testInfo.project.name;
    const supplierUserPage = new SupplierUserPage(page);
    // successMessage is fixed per portal — regenerating just for the lookup
    // is fine even though it mints a new (unused) email in the process.
    const { successMessage } = generateSupplierUser(portal);

    await supplierUserPage.expectCreationSuccessful(successMessage);
});
