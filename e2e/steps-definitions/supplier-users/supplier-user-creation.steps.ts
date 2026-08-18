import { createBdd } from 'playwright-bdd';
import { SupplierUserPage } from '../../pages/supplier-users/SupplierUserCreatePage';
import { generateSupplierUser, NewSupplierUser } from '../../fixtures/supplierUser';
import { StepperStepKey } from '../../fixtures/data/stepperLabels';

const { Given, When, Then } = createBdd();

// The exact user (email included) created earlier in the scenario — later
// steps (summary check, list check) need to assert against this, not a
// freshly generated one, since the email is unique per generation.
let createdUser: NewSupplierUser;

Given('the super admin is on the supplier user creation page', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToCreatePage();
});

Then('the stepper is on step {string}', async ({ page, $testInfo }, stepKey: string) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.expectStepperOnStep(stepKey as StepperStepKey, $testInfo.project.name);
});

Then('the stepper advances to step {string}', async ({ page, $testInfo }, stepKey: string) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.expectStepperOnStep(stepKey as StepperStepKey, $testInfo.project.name);
});

When('the super admin fills in the account details with valid data', async ({ page, $testInfo }) => {
    const portal = $testInfo.project.name;
    const supplierUserPage = new SupplierUserPage(page);
    createdUser = generateSupplierUser(portal);

    await supplierUserPage.fillAccountDetails(createdUser);
});

When('clicks Next step', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.clickNextStep();
});

When('the super admin grants all available access rights', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.grantAllAvailableAccessRights();
});

Then('the summary displays all the entered user details correctly', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.expectSummaryMatches(createdUser);
});

When('the super admin confirms the creation', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.confirmCreation();
});

Then('the supplier user is created successfully', async ({ page, $testInfo }) => {
    const portal = $testInfo.project.name;
    const supplierUserPage = new SupplierUserPage(page);
    // successMessage is fixed per portal, so regenerating just for it is fine.
    const { successMessage } = generateSupplierUser(portal);

    await supplierUserPage.expectCreationSuccessful(successMessage);
});

When('the super admin navigates to the supplier user list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.goToUserList();
});

Then('the newly created supplier user appears in the list', async ({ page }) => {
    const supplierUserPage = new SupplierUserPage(page);
    await supplierUserPage.expectSupplierUserInList(createdUser);
});
