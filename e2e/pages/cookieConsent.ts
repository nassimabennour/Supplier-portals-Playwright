import { Page } from '@playwright/test';

// Cookie banner text/timing is inconsistent across portals (localized wording,
// and it can appear after the initial page load rather than immediately), so
// this is best-effort and never fails the test if no banner shows up.
export async function acceptCookiesIfPresent(page: Page) {
    const acceptButton = page.getByRole('button', {
        name: /Tout accepter|Accept all|Accept all cookies|Accept/i,
    });

    try {
        await acceptButton.first().click({ timeout: 5_000 });
    } catch {
        // No cookie banner shown — nothing to do.
    }
}
