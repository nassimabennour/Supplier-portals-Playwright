import { Page, Locator, expect } from '@playwright/test';

export class SalesDeclarationCreatePage {
    readonly page: Page;

    readonly fileInput: Locator;

    readonly supplierSection: Locator;
    readonly supplierToggleButton: Locator;
    readonly supplierDropdownPanel: Locator;

    readonly userToggleButton: Locator;

    readonly campaignNameInput: Locator;

    readonly reminderDateInput: Locator;

    readonly createButton: Locator;
    readonly fileErrorMessage: Locator;

    readonly cancelButton: Locator;
    readonly leaveWithoutSavingButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Hidden by design — setInputFiles() works without the drag-drop UI.
        this.fileInput = page.locator('#fileInput');

        // Supplier and user toggles share an id (app bug) — scoped by
        // wrapper class instead.
        this.supplierSection = page.locator('.supplier-user-section-type');
        this.supplierToggleButton = this.supplierSection.locator('.dropdown.flex-nowrap button');
        this.supplierDropdownPanel = page.locator('#dropdown-animated');

        // aria-haspopup singles out the real toggle from a hidden search icon.
        this.userToggleButton = this.supplierSection.locator('.multi-select-dropdown button[aria-haspopup="true"]');

        this.campaignNameInput = page.locator('.campaign-section').getByPlaceholder('Name of the campaign');

        this.reminderDateInput = page.locator('#classicDatePicker');

        this.createButton = page.getByRole('button', { name: 'Create', exact: true });

        // Shown when the file fails validation (wrong type or too big);
        // Create stays disabled while this is visible.
        this.fileErrorMessage = page.locator('.error-message-title');

        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });

        // Cancel opens a confirm-leave modal — this button actually
        // discards and navigates away.
        this.leaveWithoutSavingButton = page.getByRole('button', { name: 'No, I want to leave', exact: true });
    }

    async uploadFile(filePath: string) {
        await this.fileInput.setInputFiles(filePath);
    }

    async selectSupplier(supplierName: string) {
        // Clicking the input only focuses it — the chevron is the real trigger.
        await this.supplierToggleButton.click();
        await expect(this.supplierDropdownPanel).toBeVisible({ timeout: 10_000 });

        // "All Suppliers" leaves the user picker permanently disabled.
        await this.supplierDropdownPanel.getByText(supplierName, { exact: true }).click();
    }

    async selectUser(userName: string) {
        // Enables only after picking a supplier, with a short fetch delay.
        await expect(this.userToggleButton).toBeEnabled({ timeout: 10_000 });
        await this.userToggleButton.click();

        // Matched by exact name — the radio's index-based id isn't stable,
        // and a substring match could hit two names that overlap.
        const userOption = this.supplierSection.locator('label.custom-control-label').getByText(userName, { exact: true });
        await expect(userOption).toBeVisible({ timeout: 10_000 });
        await userOption.click();
    }

    async fillCampaignName(campaignName: string) {
        // Unmatched name becomes a new campaign on submit — no dropdown click needed.
        await this.campaignNameInput.fill(campaignName);
    }

    async setReminderDate() {
        // Filled directly rather than driven through the calendar widget:
        // picking "tomorrow" by cell position (e.g. nth(1)) breaks at month
        // boundaries, since which cell that is shifts or vanishes depending
        // on how the picker renders the turn of the month.
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const yyyy = tomorrow.getFullYear();

        await this.reminderDateInput.fill(`${dd}/${mm}/${yyyy}`);
        await this.reminderDateInput.press('Tab');
    }

    async submit() {
        await this.createButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
        await this.leaveWithoutSavingButton.click();
    }

    async expectFileRejected(expectedMessage: string) {
        await expect(this.fileErrorMessage).toHaveText(expectedMessage, { timeout: 10_000 });
        await expect(this.createButton).toBeDisabled();
    }
}
