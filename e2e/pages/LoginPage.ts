import { Page, Locator, expect } from '@playwright/test';
import { PortalLocators } from '../config/portals';

export class LoginPage {
    readonly page: Page;

    // ── Locators ─────────────────────────────────────────────────
    readonly connectToViewButton: Locator | null;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly emailFormatError: Locator;
    readonly requiredFieldError: Locator;

    constructor(page: Page, locators?: PortalLocators) {
        this.page = page;

        const l = locators?.login;

        this.connectToViewButton = l?.connectToViewText
            ? page.getByRole('button', { name: l.connectToViewText })
            : null;

        this.emailInput    = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton   = page.locator('#next');
        this.errorMessage  = page.locator('#localAccountForm > div.error.pageLevel > p');
        this.emailFormatError = page.getByText('Please enter a valid email address', { exact: false });
        this.requiredFieldError = page.getByText(/Please enter your (email address|password)/i).first();
    }

    // ── Navigation ───────────────────────────────────────────────
    async goto() {
        await this.page.goto('/');
    }

    // ── Actions ──────────────────────────────────────────────────
    async fillEmail(email: string) {
        await this.emailInput.waitFor({ state: 'visible' });
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.waitFor({ state: 'visible' });
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.waitFor({ state: 'visible' });
        await this.loginButton.click();
    }

    async login(email: string, password: string) {
        if (this.connectToViewButton) {
            await this.connectToViewButton.click();
            await this.page.waitForLoadState('networkidle');
        }

        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async submitEmptyForm() {
        if (this.connectToViewButton) {
            await this.connectToViewButton.click();
            await this.page.waitForLoadState('networkidle');
        }

        await this.clickLogin();
    }

    async enterInvalidEmailFormat(malformedEmail: string) {
        if (this.connectToViewButton) {
            await this.connectToViewButton.click();
            await this.page.waitForLoadState('networkidle');
        }

        await this.fillEmail(malformedEmail);
        await this.fillPassword('SomePassword123!');
        await this.clickLogin();
    }

    // ── Assertions ───────────────────────────────────────────────
    async expectLoginFormVisible() {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async expectRedirectedAfterLogin() {
        await expect(this.page).toHaveURL(/home/);
    }

    async expectLoginError() {
        await expect(this.errorMessage).toBeVisible();
    }

    async expectInvalidEmailFormatError() {
        await expect(this.emailFormatError).toBeVisible();
    }

    async expectRequiredFieldError() {
        await expect(this.requiredFieldError).toBeVisible();
    }
}
