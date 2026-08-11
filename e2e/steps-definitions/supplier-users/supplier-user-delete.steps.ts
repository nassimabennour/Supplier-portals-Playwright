import { Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../../pages/supplier-users/SupplierUserCreatePage';
import { SupplierUserDeletePage } from '../../pages/supplier-users/SupplierUserDeletePage';
import { generateSupplierUser, generateUniqueId, DELETE_TEST_NAME, CANCEL_DELETE_TEST_NAME, NewSupplierUser } from '../../fixtures/supplierUser';

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
        // Suffixed with a per-run unique ID — DELETE_TEST_NAME/
        // CANCEL_DELETE_TEST_NAME are fixed strings, and reusing the exact
        // same name every run means a single run that ever fails to fully
        // delete its row leaves permanent debris: the next run's search for
        // "the one user it just created" then matches that leftover row
        // too, so it looks removed/present unpredictably regardless of
        // whether the delete/cancel just performed actually worked.
        lastName: `${name.lastName}${generateUniqueId()}`,
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
    // Name only — the delete/cancel user's last name carries a per-run unique
    // ID, so the name alone is unambiguous. Passing supplierName would force
    // the fragile two-input "which box is supplier vs. user" guessing (see
    // openUserByFullName), which has no upside here.
    await supplierUserPage.openUserByFullName(userToDelete.firstName, userToDelete.lastName);
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
    // matchBySupplier: false — see openUserByFullName call above; the unique
    // name is enough, and skipping the supplier filter avoids the two-input
    // column-order guessing.
    await supplierUserPage.expectSupplierUserNotInList(userToDelete, false);
});

Then('the supplier user still appears in the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
    // matchBySupplier: false — same rationale as the cancel/delete search
    // above: the unique name is enough on its own.
    await supplierUserPage.expectSupplierUserInList(userToDelete, false);
});
