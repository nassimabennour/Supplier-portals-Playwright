import { Page, Locator, expect } from '@playwright/test';
import { EditedSupplierUserFields } from '../../fixtures/supplierUser';

export class SupplierUserEditPage {
    readonly page: Page;

    readonly editButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // "ds-view-edit-supplier-user card" is reused by three different
        // cards on this page (User details, Informations, Supplier User
        // Rights), and the page separately renders a duplicate pencil icon
        // elsewhere with a real (if not user-visible) bounding box — so
        // neither the bare class nor a :visible filter disambiguates
        // reliably. Scoping to the one card that contains
        // .user-details-container is structurally unique instead.
        this.editButton = page.locator('.ds-view-edit-supplier-user.card')
            .filter({ has: page.locator('.user-details-container') })
            .locator('i.fa-pen');
    }

    // Field labels are translated per portal — R3S: "Firstname", UK/SE:
    // "First name", FR/BE: "Prénom" — and the app supports more languages
    // than just those (German, Dutch, ...), so matching label text doesn't
    // scale. Even the row wrapper's own CSS classes vary (R3S: "d-flex
    // flex-wrap mb-4", UK/FR: "d-flex flex-column flex-xl-row" — confirmed
    // via live DOM dumps of both), so matching those isn't safe either.
    // What's stable everywhere checked is DOM position: .user-details-container's
    // content wrapper always has exactly 3 direct child rows, in the same
    // order — [Job Category, Job title], [Firstname, Lastname], [Email, Phone]
    // — regardless of what classes or text those rows carry.
    private detailRow(rowIndex: number): Locator {
        return this.page.locator('.user-details-container > div > div').nth(rowIndex);
    }

    private detailField(rowIndex: number, fieldIndex: number): Locator {
        return this.detailRow(rowIndex).locator('> div').nth(fieldIndex);
    }

    private jobTitleField(): Locator {
        return this.detailField(0, 1);
    }

    private firstNameField(): Locator {
        return this.detailField(1, 0);
    }

    private lastNameField(): Locator {
        return this.detailField(1, 1);
    }

    private emailField(): Locator {
        return this.detailField(2, 0);
    }

    async enterEditMode() {
        await this.editButton.click();
        await this.firstNameField().locator('input').waitFor({ state: 'visible', timeout: 10_000 });
    }

    // Firstname/Lastname/Email are deliberately left untouched here: the edit
    // scenario finds this seed user by its exact name on every run, and
    // editing the email triggers a per-supplier "domain not certified"
    // validation that isn't reliably clearable across portals (see
    // generateEditedSupplierUser). Only Job title is actually edited.
    async fillDetails(details: EditedSupplierUserFields) {
        const jobTitleInput = this.jobTitleField().locator('input');
        await jobTitleInput.fill(details.jobTitle);
        await jobTitleInput.blur();

        // Job title alone being valid+touched isn't enough to enable Save —
        // confirmed empirically (still disabled with just this filled). The
        // Save button's enabled state appears to be wired specifically to
        // email's own valueChanges/async-validation pipeline (the same one
        // behind the "domain not certified" check), not the form's overall
        // dirty state. Re-entering the email field's *existing* value — a
        // no-op for the actual data — appears to be what's needed to trigger
        // that pipeline without introducing a new, possibly-uncertified
        // domain.
        const emailInput = this.emailField().locator('input');
        const currentEmail = await emailInput.inputValue();
        await emailInput.fill(currentEmail);
        await emailInput.blur();
    }

    async saveChanges() {
        // Button text is translated too — "Save changes" on R3S/UK/SE,
        // "Sauvegarder les modifications" on FR/BE. Its class isn't: within
        // the edit card's button row, Cancel is btn-outline-primary and Save
        // is the one plain btn-primary button, in every portal seen so far.
        const saveButton = this.page.locator('.ds-view-edit-supplier-user.card')
            .filter({ has: this.page.locator('.user-details-container') })
            .locator('button.btn-primary');
        await expect(saveButton).toBeEnabled({ timeout: 5_000 });
        await saveButton.click();

        // A "Changes saved successfully!" modal appears after saving and
        // sits on top of the page intercepting pointer events until
        // dismissed — it doesn't disappear on its own fast enough to just
        // wait it out, so it's explicitly closed here rather than left for
        // whatever the next action happens to be to fight through.
        const notificationClose = this.page.locator('.ds-notification-close');
        const appeared = await notificationClose.waitFor({ state: 'visible', timeout: 15_000 })
            .then(() => true).catch(() => false);
        if (appeared) {
            await notificationClose.click();
            await expect(notificationClose).toBeHidden({ timeout: 5_000 });
        }

        // Back to view mode is the real signal the save round-trip finished
        // — the edit inputs are gone and the pencil icon is back.
        await expect(this.editButton).toBeVisible({ timeout: 15_000 });
    }

    async expectDetailsMatch(details: EditedSupplierUserFields) {
        await expect(this.jobTitleField().locator('p.mb-0')).toHaveText(details.jobTitle);
        await expect(this.firstNameField().locator('p.mb-0')).toHaveText(details.firstName);
        await expect(this.lastNameField().locator('p.mb-0')).toHaveText(details.lastName);
    }
}
