import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../../pages/supplier-users/SupplierUserCreatePage';
import { SupplierUserDeletePage } from '../../pages/supplier-users/SupplierUserDeletePage';
import { generateSupplierUser, DELETE_TEST_NAME, NewSupplierUser } from '../../fixtures/supplierUser';

const { Given, When, Then } = createBdd();

// A throwaway user created fresh for this scenario, not a persistent seed
// user — deletion is destructive, so reusing a shared seed user (the way
// the edit feature's SEED_EDIT_USER does) would only work once.
let userToDelete: NewSupplierUser;

Given('the super admin has created a new supplier user to delete', async ({ page, $testInfo }) => {
    const portal = $testInfo.project.name;
    const supplierUserPage = new SupplierUserPage(page);
    userToDelete = {
        ...generateSupplierUser(portal),
        firstName: DELETE_TEST_NAME.firstName,
        lastName: DELETE_TEST_NAME.lastName,
    };

    await supplierUserPage.goToCreatePage();
    await supplierUserPage.fillAccountDetails(userToDelete);
    await supplierUserPage.clickNextStep();
    await supplierUserPage.grantAllAvailableAccessRights();
    await supplierUserPage.confirmCreation();
    await supplierUserPage.expectCreationSuccessful(userToDelete.successMessage);
});

When('the super admin opens the newly created user from the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
    await supplierUserPage.openUserByFullName(userToDelete.firstName, userToDelete.lastName, userToDelete.supplierName);
});

When('the super admin deletes the account', async ({ page }) => {
    const supplierUserDeletePage = new SupplierUserDeletePage(page);
    await supplierUserDeletePage.deleteAccount();
});

Then('the supplier user is removed from the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
    await supplierUserPage.expectSupplierUserNotInList(userToDelete);
});
