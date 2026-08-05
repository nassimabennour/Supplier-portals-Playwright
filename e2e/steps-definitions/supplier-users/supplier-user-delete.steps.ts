import { Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../../pages/supplier-users/SupplierUserCreatePage';
import { SupplierUserDeletePage } from '../../pages/supplier-users/SupplierUserDeletePage';
import { generateSupplierUser, DELETE_TEST_NAME, CANCEL_DELETE_TEST_NAME, NewSupplierUser } from '../../fixtures/supplierUser';

const { Given, When, Then } = createBdd();

// A throwaway user created fresh for this scenario, not a persistent seed
// user — deletion is destructive, so reusing a shared seed user (the way
// the edit feature's SEED_EDIT_USER does) would only work once.
let userToDelete: NewSupplierUser;

async function createSupplierUserWithName(
    page: Page,
    portal: string,
    name: { firstName: string; lastName: string }
): Promise<NewSupplierUser> {
    const supplierUserPage = new SupplierUserPage(page);
    const user: NewSupplierUser = {
        ...generateSupplierUser(portal),
        firstName: name.firstName,
        lastName: name.lastName,
    };

    await supplierUserPage.goToCreatePage();
    await supplierUserPage.fillAccountDetails(user);
    await supplierUserPage.clickNextStep();
    await supplierUserPage.grantAllAvailableAccessRights();
    await supplierUserPage.confirmCreation();
    await supplierUserPage.expectCreationSuccessful(user.successMessage);

    return user;
}

Given('the super admin has created a new supplier user to delete', async ({ page, $testInfo }) => {
    userToDelete = await createSupplierUserWithName(page, $testInfo.project.name, DELETE_TEST_NAME);
});

// A distinct name from the one above — this scenario cancels the deletion,
// so its user stays in the list and must not collide with the nominal
// scenario's search for its own, actually-deleted user.
Given('the super admin has created a new supplier user to test cancelling deletion', async ({ page, $testInfo }) => {
    userToDelete = await createSupplierUserWithName(page, $testInfo.project.name, CANCEL_DELETE_TEST_NAME);
});

When('the super admin opens the newly created user from the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
    await supplierUserPage.openUserByFullName(userToDelete.firstName, userToDelete.lastName, userToDelete.supplierName);
});

When('the super admin opens the delete confirmation', async ({ page }) => {
    const supplierUserDeletePage = new SupplierUserDeletePage(page);
    await supplierUserDeletePage.openDeleteModal();
});

When('the super admin confirms the deletion', async ({ page }) => {
    const supplierUserDeletePage = new SupplierUserDeletePage(page);
    await supplierUserDeletePage.confirmDeletion();
});

When('the super admin declines the deletion', async ({ page }) => {
    const supplierUserDeletePage = new SupplierUserDeletePage(page);
    await supplierUserDeletePage.cancelDeletion();
});

Then('the supplier user is removed from the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
    await supplierUserPage.expectSupplierUserNotInList(userToDelete);
});

Then('the supplier user still appears in the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
    await supplierUserPage.expectSupplierUserInList(userToDelete);
});
