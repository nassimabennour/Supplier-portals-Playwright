import { Page, Locator, expect } from '@playwright/test';

export class SalesDeclarationDetailPage {
    readonly page: Page;

    readonly documentTitle: Locator;
    readonly statusBadge: Locator;
    readonly creationStep: Locator;

    readonly downloadReuploadedFileButton: Locator;
    readonly noteTextarea: Locator;
    readonly validateRadio: Locator;
    readonly validateRadioLabel: Locator;
    readonly rejectRadio: Locator;
    readonly rejectRadioLabel: Locator;
    readonly sendButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.documentTitle = page.locator('.document-title');
        this.statusBadge = page.locator('.title-status .badge');

        // Only "Creation" is checked here — later lifecycle steps aren't
        // part of this assertion.
        this.creationStep = page.locator('.validated-step', { hasText: 'Creation' });

        // Reused preview widget: shows the uploaded file, then the
        // re-uploaded one once the Correction step is reached.
        this.downloadReuploadedFileButton = page.locator('.download-icon');

        this.noteTextarea = page.locator('#textareaexample');

        // Both start disabled until the re-uploaded file above is
        // downloaded first.
        this.validateRadio = page.locator('#validate-sales-radio');

        // Hidden <input>; its <label> sits on top and receives the click.
        this.validateRadioLabel = page.locator('label[for="validate-sales-radio"]');

        // Same pattern as validateRadio, same radio group, different id/value.
        this.rejectRadio = page.locator('#reject-sales-radio');
        this.rejectRadioLabel = page.locator('label[for="reject-sales-radio"]');

        this.sendButton = page.getByRole('button', { name: 'Send', exact: true });
    }

    async expectDocumentCreated(expectedTitle: string) {
        await expect(this.documentTitle).toHaveText(expectedTitle, { timeout: 20_000 });
        await expect(this.statusBadge).toHaveText('Uploaded');
        await expect(this.creationStep).toBeVisible();
    }

    async downloadReuploadedFile() {
        // This route isn't reload-safe (reload blanks the page) — the
        // radios are already in the DOM, just disabled, and enable in
        // place once the download completes. No reload needed.
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadReuploadedFileButton.click(),
        ]);
        await download.path();
    }

    async validateWithNote(note: string) {
        await expect(this.validateRadio).toBeEnabled({ timeout: 10_000 });
        await this.validateRadioLabel.click();
        await expect(this.validateRadio).toBeChecked();
        await this.noteTextarea.fill(note);

        await expect(this.sendButton).toBeEnabled({ timeout: 10_000 });
        await this.sendButton.click();
    }

    async rejectWithNote(note: string) {
        await expect(this.rejectRadio).toBeEnabled({ timeout: 10_000 });
        await this.rejectRadioLabel.click();
        await expect(this.rejectRadio).toBeChecked();
        await this.noteTextarea.fill(note);

        await expect(this.sendButton).toBeEnabled({ timeout: 10_000 });
        await this.sendButton.click();
    }

    async expectValidated() {
        await expect(this.statusBadge).toHaveText('Validated', { timeout: 20_000 });
        await expect(this.statusBadge).toHaveClass(/badge-default-success/);
    }

    async expectRejected() {
        await expect(this.statusBadge).toHaveText('Rejected', { timeout: 20_000 });
        await expect(this.statusBadge).toHaveClass(/badge-default-danger/);
    }
}
