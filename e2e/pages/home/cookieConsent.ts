import { Page, Locator, expect } from '@playwright/test';

// Cookie banner text is localized per portal ("Accept" / "Accepter" / etc.)
// and matching by wording keeps breaking as new languages show up, so this
// targets the DOM structure instead: the modal has a stable id (#cookieModal)
// across portals, and its footer always renders the buttons in the same
// order — Manage my choices / Refuse / Accept — regardless of language, so
// the accept action is always the last button.
// It can also appear after the initial page load rather than immediately,
// so this is best-effort and never fails the test if no banner shows up.

export class CookieConsent {
    readonly acceptButton: Locator;

    constructor(page: Page) {
        this.acceptButton = page.locator('#cookieModal .modal-footer button').last();
    }

    async acceptIfPresent() {
        if (await this.acceptButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await this.acceptButton.click();
        }
    }

    // The banner can reappear and swallow a click meant for something else —
    // retries dismiss+click together until one attempt lands clean.
    async acceptThenClick(target: Locator) {
        await expect(async () => {
            await this.acceptIfPresent();
            await target.click({ timeout: 5_000 });
        }).toPass({ timeout: 30_000 });
    }
}
