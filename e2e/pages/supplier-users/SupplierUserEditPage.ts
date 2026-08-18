import { Page, Locator, expect } from '@playwright/test';
import { EditedSupplierUserFields } from '../../fixtures/supplierUser';

export class SupplierUserEditPage {
    readonly page: Page;

    readonly editButton: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Scoped to the card containing .user-details-container — the bare
        // classes/icons below are duplicated elsewhere on the page.
        const detailsCard = page.locator('.ds-view-edit-supplier-user.card')
            .filter({ has: page.locator('.user-details-container') });

        // Used by: enterEditMode(), saveChanges(), cancelEdit().
        this.editButton = detailsCard.locator('i.fa-pen');
        // Identified by class, not (translated) text — Save/Cancel are the
        // plain btn-primary / btn-outline-primary buttons in the card's
        // button row. Used by: saveChanges().
        this.saveButton = detailsCard.locator('button.btn-primary');
        // Used by: cancelEdit().
        this.cancelButton = detailsCard.locator('button.btn-outline-primary');
    }

    // Labels/classes are translated and vary per portal, but DOM position is
    // stable: 3 rows in order — [Job Category, Job title], [Firstname,
    // Lastname], [Email, Phone].
    private detailRow(rowIndex: number): Locator {
        return this.page.locator('.user-details-container > div > div').nth(rowIndex);
    }

    private detailField(rowIndex: number, fieldIndex: number): Locator {
        return this.detailRow(rowIndex).locator('> div').nth(fieldIndex);
    }

    // Used by fillDetails() and expectDetailsMatch().
    private jobTitleField(): Locator {
        return this.detailField(0, 1);
    }

    // Used by enterEditMode() (readiness check) and expectDetailsMatch().
    private firstNameField(): Locator {
        return this.detailField(1, 0);
    }

    // Used by expectDetailsMatch().
    private lastNameField(): Locator {
        return this.detailField(1, 1);
    }

    // Used by fillDetails() (Save-button workaround, see below).
    private emailField(): Locator {
        return this.detailField(2, 0);
    }

    // Called from supplier-user-edit.steps.ts: "the super admin switches to edit mode".
    async enterEditMode() {
        await this.editButton.click();
        await this.firstNameField().locator('input').waitFor({ state: 'visible', timeout: 10_000 });
    }

    // Called from supplier-user-edit.steps.ts: "the super admin updates the account details with new data".
    // Only job title is actually changed — first/last name must stay as the
    // seed values (renaming would break next run's lookup), and editing
    // email triggers a per-supplier "domain not certified" check.
    async fillDetails(details: EditedSupplierUserFields) {
        const jobTitleInput = this.jobTitleField().locator('input');
        await jobTitleInput.fill(details.jobTitle);
        await jobTitleInput.blur();

        // Job title alone doesn't enable Save — Save appears wired to
        // email's own validation pipeline, not overall form-dirty state.
        // Re-filling email with its own current value (a no-op) triggers
        // that pipeline without risking an uncertified domain.
        const emailInput = this.emailField().locator('input');
        const currentEmail = await emailInput.inputValue();
        await emailInput.fill(currentEmail);
        await emailInput.blur();
    }

    // Called from supplier-user-edit.steps.ts: "the super admin saves the changes".
    async saveChanges() {
        await expect(this.saveButton).toBeEnabled({ timeout: 5_000 });
        await this.saveButton.click();

        // Dismiss the "Changes saved successfully!" modal if it shows — it
        // blocks pointer events until closed.
        const notificationClose = this.page.locator('.ds-notification-close');
        const appeared = await notificationClose.waitFor({ state: 'visible', timeout: 15_000 })
            .then(() => true).catch(() => false);
        if (appeared) {
            await notificationClose.click();
            await expect(notificationClose).toBeHidden({ timeout: 5_000 });
        }

        // Pencil icon back = view mode = save round-trip finished.
        await expect(this.editButton).toBeVisible({ timeout: 15_000 });
    }

    // Called from supplier-user-edit.steps.ts: "the super admin cancels editing".
    // No save round-trip here, so no notification modal to dismiss — the
    // pencil icon reappearing is still the signal edit mode actually closed.
    async cancelEdit() {
        await this.cancelButton.click();
        await expect(this.editButton).toBeVisible({ timeout: 10_000 });
    }

    // Called from supplier-user-edit.steps.ts: "the supplier user details remain unchanged".
    // Checks name only, not job title: job title is optional, and when blank
    // its view-mode element isn't rendered at all (confirmed on FR) — unlike
    // Firstname/Lastname, which are required and always present.
    async expectNameUnchanged(expected: { firstName: string; lastName: string }) {
        await expect(this.firstNameField().locator('p.mb-0')).toHaveText(expected.firstName);
        await expect(this.lastNameField().locator('p.mb-0')).toHaveText(expected.lastName);
    }

    // Called from supplier-user-edit.steps.ts: "the supplier user details match the new data".
    async expectDetailsMatch(details: EditedSupplierUserFields) {
        await expect(this.jobTitleField().locator('p.mb-0')).toHaveText(details.jobTitle);
        await expect(this.firstNameField().locator('p.mb-0')).toHaveText(details.firstName);
        await expect(this.lastNameField().locator('p.mb-0')).toHaveText(details.lastName);
    }
}
