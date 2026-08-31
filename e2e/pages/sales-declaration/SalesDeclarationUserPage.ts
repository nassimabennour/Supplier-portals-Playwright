import { Page, Locator, expect } from '@playwright/test';
import { CookieConsent } from '../home/cookieConsent';

export class SalesDeclarationUserPage {
    readonly page: Page;

    readonly secureDataNavToggle: Locator;
    readonly salesDeclarationsLink: Locator;
    readonly downloadButton: Locator;
    readonly reuploadFileInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Nav renders twice (desktop/mobile) — :visible picks the shown copy.
        this.secureDataNavToggle = page.locator('a.nav-link.cropped-nav-name:visible');
        this.salesDeclarationsLink = page.locator('a[routerlink="/sales"]:visible');

        // Scoped to .document-upload — name/icon alone is ambiguous since
        // the timeline and "Rexel's affiliates" panel also have "Download"
        // buttons. Assumes exactly one pending declaration for this
        // supplier/user; only review.feature's own scenarios are
        // @mode:serial with each other, so a declaration created
        // concurrently by create.feature could still race this.
        this.downloadButton = page.locator('.document-upload').getByRole('button', { name: 'Download', exact: true });

        // Hidden by design, same as the creation form's upload widget.
        this.reuploadFileInput = page.locator('#fileInput');
    }

    async goToSalesDeclarations() {
        // Same cookie-modal race as the admin side — a fresh session can
        // hit it too.
        await new CookieConsent(this.page).acceptThenClick(this.secureDataNavToggle);

        await this.salesDeclarationsLink.click();
        await expect(this.downloadButton).toBeVisible({ timeout: 15_000 });
    }

    async downloadCurrentDeclaration() {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadButton.click(),
        ]);
        await download.path();

        // The #fileInput dropzone only appears after the page re-fetches
        // state, so reload here too.
        await this.page.reload();
    }

    async reuploadFile(filePath: string) {
        await this.reuploadFileInput.setInputFiles(filePath);
    }

    private oldValidatedDeclarationRow(campaignName: string): Locator {
        return this.page.locator('.validated-sales', { hasText: campaignName });
    }

    async downloadFromOldValidatedDeclarations(campaignName: string) {
        // Validation happened on the admin's page — reload to see it here.
        await this.page.reload();

        const row = this.oldValidatedDeclarationRow(campaignName);
        await expect(row).toBeVisible({ timeout: 15_000 });

        const downloadButton = row.getByRole('button', { name: 'Download', exact: true });
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            downloadButton.click(),
        ]);
        await download.path();
    }
}
