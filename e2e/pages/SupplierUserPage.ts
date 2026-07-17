import { Page, Locator, expect } from '@playwright/test';
import { NewSupplierUser } from '../fixtures/supplierUser';
import { acceptCookiesIfPresent } from './cookieConsent';

export class SupplierUserPage {
    readonly page: Page;

    // ── Locators ─────────────────────────────────────────────────
    readonly adminMenuToggle: Locator;
    readonly supplierUserMenu: Locator;
    readonly createMenuItem: Locator;

    readonly supplierDropdown: Locator;
    readonly supplierSearchInput: Locator;
    readonly supplierApplyButton: Locator;

    readonly countryDropdown: Locator;
    readonly countrySearchInput: Locator;

    readonly jobCategoryDropdown: Locator;
    readonly jobTitleInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly confirmEmailInput: Locator;

    readonly nextStepButton: Locator;
    readonly createSupplierUserButton: Locator;
    readonly confirmationMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.adminMenuToggle = page.locator('#adminConsoleBtn');
        this.supplierUserMenu = page.locator('h4.link-section-header', { hasText: 'Supplier User' });
        this.createMenuItem   = page.locator('h5.create-user');

        this.supplierDropdown     = page.locator('div.supplier-dropdown #dropdownMenuButtonForm');
        this.supplierSearchInput  = page.locator('div.supplier-dropdown #dropdownSearchExample');
        this.supplierApplyButton  = page.getByRole('button', { name: 'Apply' }).first();

        this.countryDropdown      = page.locator('div.country-dropdown button[data-toggle="dropdown"]');
        this.countrySearchInput   = page.locator('div.country-dropdown input[placeholder="Search a country"]');

        this.jobCategoryDropdown  = page.locator('#dropdown-category-button');
        this.jobTitleInput        = page.locator('[data-test="job-title"]');
        this.firstNameInput       = page.locator('[data-test="first-name"]');
        this.lastNameInput        = page.locator('[data-test="last-name"]');
        this.emailInput           = page.locator('[data-test="email"]');
        this.confirmEmailInput    = page.locator('[data-test="email-confirm"]');

        this.nextStepButton          = page.getByRole('button', { name: 'Next step' });
        this.createSupplierUserButton = page.getByRole('button', { name: 'Create supplier user' });
        this.confirmationMessage      = page.getByText('User created and linked successfully!');
    }

    // ── Navigation ───────────────────────────────────────────────
    async goToCreatePage() {
        await this.adminMenuToggle.waitFor({ state: 'visible', timeout: 15_000 });
        await acceptCookiesIfPresent(this.page);
        await this.adminMenuToggle.click();

        if (!(await this.createMenuItem.isVisible())) {
            await this.supplierUserMenu.click();
        }
        await this.createMenuItem.waitFor({ state: 'visible', timeout: 10_000 });
        await this.createMenuItem.click();
    }

    // ── Step 1: Account details ─────────────────────────────────
    async fillAccountDetails(user: NewSupplierUser) {
        await this.supplierDropdown.click();
        await this.supplierSearchInput.fill(user.supplier);
        await this.page.locator('ul.multi-select-checkbox').getByText(user.supplier, { exact: true }).click();
        await this.supplierApplyButton.click();

        await this.countryDropdown.click();
        await this.countrySearchInput.fill(user.country);
        await this.page.locator('div.country-dropdown ul.multi-select-checkbox').getByText(user.country, { exact: true }).click();
        await this.page.keyboard.press('Escape');

        await this.jobCategoryDropdown.click();
        await this.page.getByText(user.jobCategory, { exact: true }).click();

        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.jobTitleInput.fill(user.jobTitle);
        await this.emailInput.pressSequentially(user.email, { delay: 20 });
        await this.confirmEmailInput.waitFor({ state: 'attached' });
        await this.confirmEmailInput.pressSequentially(user.email, { delay: 20 });

        await this.nextStepButton.click();
    }

    // ── Step 2: Access Rights (kept at defaults) ────────────────
    async continueWithDefaultAccessRights() {
        await this.nextStepButton.click();
    }

    // ── Step 3: Summary ──────────────────────────────────────────
    async confirmCreation() {
        await this.createSupplierUserButton.click();
    }

    async createSupplierUser(user: NewSupplierUser) {
        await this.goToCreatePage();
        await this.fillAccountDetails(user);
        await this.continueWithDefaultAccessRights();
        await this.confirmCreation();
    }

    // ── Assertions ───────────────────────────────────────────────
    async expectCreationSuccessful() {
        await expect(this.confirmationMessage).toBeVisible({ timeout: 30_000 });
    }
}
