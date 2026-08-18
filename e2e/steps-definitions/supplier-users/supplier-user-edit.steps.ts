import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../../pages/supplier-users/SupplierUserCreatePage';
import { SupplierUserEditPage } from '../../pages/supplier-users/SupplierUserEditPage';
import { generateEditedSupplierUser, EditedSupplierUserFields, SEED_EDIT_USER } from '../../fixtures/supplierUser';

const { Given, When, Then } = createBdd();

let newDetails: EditedSupplierUserFields;

Given('the super admin is on the supplier user list page', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
});

When('the super admin opens the seed edit user from the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.openUserByFullName(SEED_EDIT_USER.firstName, SEED_EDIT_USER.lastName);
});

When('the super admin switches to edit mode', async ({ page }) => {
    const supplierUserEditPage = new SupplierUserEditPage(page);
    await supplierUserEditPage.enterEditMode();
});

When('the super admin updates the account details with new data', async ({ page }) => {
    const supplierUserEditPage = new SupplierUserEditPage(page);
    newDetails = generateEditedSupplierUser();

    await supplierUserEditPage.fillDetails(newDetails);
});

When('the super admin saves the changes', async ({ page }) => {
    const supplierUserEditPage = new SupplierUserEditPage(page);
    await supplierUserEditPage.saveChanges();
});

When('the super admin cancels editing', async ({ page }) => {
    const supplierUserEditPage = new SupplierUserEditPage(page);
    await supplierUserEditPage.cancelEdit();
});

Then('the supplier user details match the new data', async ({ page }) => {
    const supplierUserEditPage = new SupplierUserEditPage(page);
    await supplierUserEditPage.expectDetailsMatch(newDetails);
});

Then('the supplier user details remain unchanged', async ({ page }) => {
    const supplierUserEditPage = new SupplierUserEditPage(page);
    await supplierUserEditPage.expectNameUnchanged(SEED_EDIT_USER);
});
