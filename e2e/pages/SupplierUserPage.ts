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
    readonly supplierApplyButton: Locator;

    readonly countryDropdown: Locator;

    readonly jobCategoryDropdown: Locator;
    readonly jobTitleInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly confirmEmailInput: Locator;

    readonly nextStepButton: Locator;
    readonly createSupplierUserButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // There are two near-identical "user-cog" icons in the header markup
        // across portals; only this exact class combination is the real,
        // clickable admin console trigger (the other is a decorative
        // duplicate with a permanently 0x0 layout box).
        this.adminMenuToggle = page.locator('i.fa-user-cog.pl-3.pt-2.pr-2.pb-2');
        this.supplierUserMenu = page.locator('h4.link-section-header', { hasText: 'Supplier User' });
        this.createMenuItem   = page.locator('h5.create-user');

        this.supplierDropdown     = page.locator('div.supplier-dropdown #dropdownMenuButtonForm');
        this.supplierApplyButton  = page.getByRole('button', { name: 'Apply' }).first();

        this.countryDropdown      = page.locator('div.country-dropdown button[data-toggle="dropdown"]');

        this.jobCategoryDropdown  = page.locator('#dropdown-category-button');
        this.jobTitleInput        = page.locator('[data-test="job-title"]');
        this.firstNameInput       = page.locator('[data-test="first-name"]');
        this.lastNameInput        = page.locator('[data-test="last-name"]');
        this.emailInput           = page.locator('[data-test="email"]');
        this.confirmEmailInput    = page.locator('[data-test="email-confirm"]');

        this.nextStepButton          = page.getByRole('button', { name: 'Next step' });
        this.createSupplierUserButton = page.getByRole('button', { name: 'Create supplier user' });
    }

    // ── Navigation ───────────────────────────────────────────────
    async goToCreatePage() {
        await acceptCookiesIfPresent(this.page);

        await this.adminMenuToggle.waitFor({ state: 'visible', timeout: 15_000 });
        await this.adminMenuToggle.click();

        if (!(await this.createMenuItem.isVisible())) {
            await this.supplierUserMenu.click();
        }
        await this.createMenuItem.waitFor({ state: 'visible', timeout: 10_000 });
        await this.createMenuItem.click();
    }

    // Some portals show an Apply button per dropdown, others close on
    // selection alone — only click it if it's actually there.
    private async clickIfVisible(button: Locator): Promise<void> {
        if (await button.isVisible().catch(() => false)) {
            await button.click();
        }
    }

    // ── Step 1: Account details ─────────────────────────────────
    async fillAccountDetails(user: NewSupplierUser) {
        await this.supplierDropdown.click();
        await this.page.locator('div.supplier-dropdown ul.multi-select-checkbox li h4')
            .getByText(user.supplierName, { exact: true }).click();
        await this.clickIfVisible(this.supplierApplyButton);
        await this.page.keyboard.press('Escape');

        if (user.country) {
            await this.countryDropdown.waitFor({ state: 'visible', timeout: 10_000 });
            await this.countryDropdown.click();
            await this.page.locator('div.country-dropdown ul.multi-select-checkbox li h4')
                .getByText(user.country, { exact: true }).click();
            await this.clickIfVisible(this.page.locator('div.country-dropdown').getByRole('button', { name: 'Apply' }));
            await this.page.keyboard.press('Escape');
        }

        await this.jobCategoryDropdown.click();
        await this.page.locator('#dropdown-animated h4').getByText(user.jobCategory, { exact: true }).click();

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
        // Some portals pre-check default reports (satisfying the "at least
        // one access" requirement automatically), others don't — check the
        // first available report ourselves if Next step is still disabled.
        if (!(await this.nextStepButton.isEnabled())) {
            await this.page.locator('table input[type="checkbox"]:not(:disabled)').first().check();
        }
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
    async expectCreationSuccessful(successMessage: string) {
        await expect(this.page.getByText(successMessage)).toBeVisible({ timeout: 30_000 });
    }
}
