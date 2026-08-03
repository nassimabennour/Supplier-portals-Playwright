import { Page, Locator, expect } from '@playwright/test';

export class SupplierUserDeletePage {
    readonly page: Page;

    readonly deleteAccountButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly keepUserButton: Locator;
    readonly deletedToast: Locator;

    constructor(page: Page) {
        this.page = page;

        this.deleteAccountButton = page.locator('button[data-target="#supplierUserDeleteModal"]');

        // Button text ("Yes, I want to delete him" / "No, I want to keep
        // him") is translated per portal like everything else in this app,
        // and unlike the edit card's Save/Cancel, the *confirm* action here
        // is the outline-primary button while *keep* is the plain
        // btn-primary one — so class doesn't disambiguate either. Position
        // within the modal footer is what's stable: confirm is always the
        // first button, keep the second.
        const modalFooterButtons = page.locator('#supplierUserDeleteModal .modal-footer button');
        this.confirmDeleteButton = modalFooterButtons.nth(0);
        this.keepUserButton = modalFooterButtons.nth(1);

        // "User successfully deleted" is translated per portal — data-cy is
        // the app's own test hook on this element and isn't.
        this.deletedToast = page.locator('[data-cy="toast-header"]');
    }

    async deleteAccount() {
        await this.deleteAccountButton.click();
        await expect(this.confirmDeleteButton).toBeVisible({ timeout: 10_000 });
        await this.confirmDeleteButton.click();

        // The toast auto-hides after its own data-delay (3s) — assert while
        // it's up rather than assuming it's still there by the time the
        // next step runs.
        await expect(this.deletedToast).toBeVisible({ timeout: 15_000 });
    }
}
