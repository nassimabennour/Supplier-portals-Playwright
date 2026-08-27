import { Page, Locator, expect } from '@playwright/test';
import { CookieConsent } from '../home/cookieConsent';

export class SalesDeclarationListPage {
    readonly page: Page;

    readonly adminConsoleButton: Locator;
    readonly secureDataExchangeToggle: Locator;
    readonly manageSalesDeclarationLink: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Reveals the admin sidebar — hidden by default on Home.
        this.adminConsoleButton = page.locator('#adminConsoleBtn');

        // Starts collapsed; .manage-sales isn't visible until this is clicked.
        this.secureDataExchangeToggle = page.locator('a[data-target="#secure-sub-link"]');

        // App's own class — stable across languages, unlike the link text.
        this.manageSalesDeclarationLink = page.locator('.manage-sales');

        // Loose match — the button's own text has a typo ("Creat a sales
        // declaration").
        this.createButton = page.getByRole('button', { name: /sales declaration/i });
    }

    async goToManageSalesDeclaration() {
        // Cookie modal can reappear after Background's own check passed and
        // block this click — toPass() retries both together.
        const cookieConsent = new CookieConsent(this.page);
        await expect(async () => {
            await cookieConsent.acceptIfPresent();
            await this.adminConsoleButton.click({ timeout: 5_000 });
        }).toPass({ timeout: 30_000 });

        await this.secureDataExchangeToggle.click();
        await this.manageSalesDeclarationLink.click();
        await expect(this.createButton).toBeVisible({ timeout: 10_000 });
    }

    async goToCreatePage() {
        await this.goToManageSalesDeclaration();
        await this.createButton.click();
    }

    private rowByCampaign(campaignName: string): Locator {
        return this.page.locator('tr', { hasText: campaignName });
    }

    async openDeclarationByCampaign(campaignName: string) {
        await this.goToManageSalesDeclaration();

        const row = this.rowByCampaign(campaignName);
        await expect(row).toBeVisible({ timeout: 15_000 });
        await row.locator('[data-title="View and Edit"]').click();
    }

    async expectDeclarationValidated(campaignName: string) {
        await this.goToManageSalesDeclaration();

        const row = this.rowByCampaign(campaignName);
        await expect(row.getByText('Validated', { exact: true })).toBeVisible({ timeout: 20_000 });
    }

    async expectOnListPage() {
        await expect(this.page).toHaveURL(/\/sales\/list/, { timeout: 10_000 });
        await expect(this.createButton).toBeVisible({ timeout: 10_000 });
    }
}
