import { Page, Locator, expect } from '@playwright/test';
import { NewSupplierUser } from '../../fixtures/supplierUser';
import { StepperStepKey, STEPPER_LABELS } from '../../fixtures/data/stepperLabels';
import { CookieConsent } from '../home/cookieConsent';

export class SupplierUserPage {
    readonly page: Page;

    // ── Locators ─────────────────────────────────────────────────
    readonly adminMenuToggle: Locator;
    readonly supplierUserMenu: Locator;
    readonly createMenuItem: Locator;
    readonly manageMenuItem: Locator;

    readonly supplierDropdown: Locator;
    readonly supplierApplyButton: Locator;

    readonly countryDropdown: Locator;

    readonly jobCategoryDropdown: Locator;
    readonly jobTitleInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly confirmEmailInput: Locator;

    readonly nextStepButton: Locator;
    readonly createSupplierUserButton: Locator;

    // Access Rights has two checkbox sections: the Reports Access table,
    // and everything under app-content-module-displayer.
    readonly reportsAccessCheckboxes: Locator;
    readonly contentAccessCheckboxes: Locator;

    // ── Supplier user list ──────────────────────────────────────
    // Candidate text search inputs in the list's header — column order
    // (User first vs. Supplier first) isn't consistent across portals, and
    // neither the placeholder text nor the header text is either (both are
    // localized), so there's no reliable way to pick "the supplier one"
    // ahead of time. expectSupplierUserInList tries each in turn instead.
    readonly userListSearchInputs: Locator;
    readonly userListRows: Locator;

    readonly activeStepLabel: Locator;

    // ── Step 3: Summary ──────────────────────────────────────────
    readonly summarySupplierName: Locator;
    readonly summaryJobCategory: Locator;
    readonly summaryJobTitle: Locator;
    readonly summaryFirstName: Locator;
    readonly summaryLastName: Locator;
    readonly summaryEmail: Locator;

    constructor(page: Page) {
        this.page = page;

        // There are two near-identical "user-cog" icons in the header markup
        // across portals; only this exact class combination is the real,
        // clickable admin console trigger (the other is a decorative
        // duplicate with a permanently 0x0 layout box).
        this.adminMenuToggle = page.locator('i.fa-user-cog.pl-3.pt-2.pr-2.pb-2');
        this.supplierUserMenu = page.locator('h4.link-section-header', { hasText: 'Supplier User' });
        this.createMenuItem   = page.locator('h5.create-user');
        this.manageMenuItem   = page.locator('h5.manage-user');

        this.supplierDropdown     = page.locator('div.supplier-dropdown #dropdownMenuButtonForm');
        this.supplierApplyButton  = page.getByRole('button', { name: 'Apply' }).first();

        this.countryDropdown      = page.locator('div.country-dropdown button[data-toggle="dropdown"]');

        this.jobCategoryDropdown  = page.locator('#dropdown-category-button');
        this.jobTitleInput        = page.locator('[data-test="job-title"]');
        this.firstNameInput       = page.locator('[data-test="first-name"]');
        this.lastNameInput        = page.locator('[data-test="last-name"]');
        this.emailInput           = page.locator('[data-test="email"]');
        this.confirmEmailInput    = page.locator('[data-test="email-confirm"]');

        // data-test avoids relying on button text, which is localized.
        this.nextStepButton          = page.locator('[data-test="next-step"]');
        this.createSupplierUserButton = page.locator('[data-test="create-supplier-user-button"]');

        // Scoped to the wrapping "custom-checkbox" div rather than the raw
        // input — checkCheckbox needs the wrapper's own visibility (the
        // label inside always has a 0x0 box, so it's useless as a signal)
        // to tell a genuinely available row from an RLS-locked one.
        // Deliberately not using :has() here — checkCheckbox filters out
        // rows with no/disabled input itself.
        this.reportsAccessCheckboxes  = page.locator('app-multiple-module-displayer .custom-checkbox');
        this.contentAccessCheckboxes  = page.locator('app-content-module-displayer .custom-checkbox');

        // Some portals (BE, FR, DE, UK, ...) render both a pending-requests
        // table and the actual user list on this page, with visually
        // identical rows and the same search placeholder text in both.
        // Others (e.g. R3S) don't have the request-table feature at all and
        // render the list bare. Scoping to this class handles both cases
        // uniformly, with no portal-specific conditional needed: it's
        // present in both structures, and reliably distinct from the
        // request table's differently-named "...-request-table-container".
        this.userListSearchInputs = page.locator('div.supplier-user-table-container thead input[type="text"]');
        this.userListRows         = page.locator('div.supplier-user-table-container table tbody tr.d-flex');

        this.activeStepLabel = page.locator('li.active-step .step-label');

        this.summarySupplierName = page.locator('[data-test="supplier-summary"]');
        this.summaryJobCategory  = page.locator('[data-test="job-category-summary"]');
        this.summaryJobTitle     = page.locator('[data-test="job-title-summary"]');
        this.summaryFirstName    = page.locator('[data-test="firstname-summary"]');
        this.summaryLastName     = page.locator('[data-test="lastname-summary"]');
        this.summaryEmail        = page.locator('[data-test="email-address-summary"]');
    }

    // ── Navigation ───────────────────────────────────────────────
    private async openSupplierUserMenu() {
        // The sidebar can already be open (e.g. right after creating a user),
        // in which case there's no toggle to click at all.
        if (await this.createMenuItem.isVisible().catch(() => false)) {
            return;
        }

        const cookieConsent = new CookieConsent(this.page);
        await cookieConsent.acceptIfPresent();

        // The B2C OAuth redirect chain can still be settling here (same
        // cause as LoginPage.expectRedirectedAfterLogin's longer timeout),
        // so give this more room than a typical UI wait.
        await this.adminMenuToggle.waitFor({ state: 'visible', timeout: 30_000 });
        // The cookie banner can still appear between the check above and
        // this click (it doesn't always show immediately after login) —
        // check once more right at the point of failure.
        await cookieConsent.acceptIfPresent();
        await this.adminMenuToggle.click();

        if (!(await this.createMenuItem.isVisible())) {
            await this.supplierUserMenu.click();
        }
    }

    async goToCreatePage() {
        await this.openSupplierUserMenu();
        await this.createMenuItem.waitFor({ state: 'visible', timeout: 10_000 });
        await this.createMenuItem.click();
    }

    async goToUserList() {
        await this.openSupplierUserMenu();
        await this.manageMenuItem.waitFor({ state: 'visible', timeout: 10_000 });
        await this.manageMenuItem.click();
    }

    // Some portals show an Apply button per dropdown, others close on
    // selection alone — only click it if it's actually there.
    private async clickIfVisible(button: Locator): Promise<void> {
        if (await button.isVisible().catch(() => false)) {
            await button.click();
        }
    }

    // ── Step 1: Account details ─────────────────────────────────
    // Some portals (USA, CA, NL, ...) require selecting at least one item
    // per chosen supplier from a required dropdown — called "Regions" in
    // some portals, "Banners" in others. Each has a "select all" convenience
    // entry, but clicking it doesn't reliably cascade-check the individual
    // items (Angular's real validity here seems to be driven by the actual
    // individual checkboxes, not an "all" flag), so every individual item is
    // clicked directly instead. Rather than needing a per-supplier options
    // list or per-portal translations, items are found generically (any
    // checkbox in the panel not prefixed "all-", matching the "all-regions-"/
    // "all-banners-" convention seen so far) and skipped entirely if the
    // whole field isn't present for this portal.
    private async selectAllRegions() {
        const dropdownButtons = this.page.locator('.company-region-item .ds-region-dropdown-button');
        // This section renders after supplier selection is processed, not
        // instantly — wait for it rather than counting immediately, or
        // portals that do have it race past with 0 and silently no-op.
        await dropdownButtons.first().waitFor({ state: 'attached', timeout: 5_000 }).catch(() => {});
        const count = await dropdownButtons.count();

        for (let i = 0; i < count; i++) {
            const button = dropdownButtons.nth(i);
            const panelId = await button.getAttribute('aria-controls');
            await button.click();

            const panel = panelId ? this.page.locator(`#${panelId}`) : this.page;
            const items = panel.locator('input[type="checkbox"]');
            // The panel opens asynchronously — wait for its content to
            // actually be there before reading from it, rather than
            // querying immediately after the click.
            await items.first().waitFor({ state: 'attached', timeout: 5_000 });
            const itemCount = await items.count();

            for (let j = 0; j < itemCount; j++) {
                const input = items.nth(j);
                const id = await input.getAttribute('id');
                if (!id || id.startsWith('all-')) continue;

                // A native JS click on the label, not a manual checked+change
                // on the input — this field's real validity (what controls
                // the red border) is likely driven by an actual (click)
                // handler on the label, not the input's change event, so
                // setting the property directly can leave a checkbox looking
                // ticked while Angular's real state never updates. label
                // .click() via evaluate() doesn't need real
                // coordinates/visibility the way Playwright's own
                // locator.click() does (that's what failed earlier with
                // "outside of the viewport" on this permanently 0x0
                // element), but it still fires a genuine bubbling click
                // event.
                const label = panel.locator(`label[for="${id}"]`).first();
                await label.evaluate((el: HTMLElement) => el.click());
                await expect(input).toBeChecked({ timeout: 3_000 });
            }

            await this.page.keyboard.press('Escape');
        }
    }

    async fillAccountDetails(user: NewSupplierUser) {
        await this.supplierDropdown.click();
        await this.page.locator('div.supplier-dropdown ul.multi-select-checkbox li h4')
            .getByText(user.supplierName, { exact: true }).click();
        await this.clickIfVisible(this.supplierApplyButton);
        await this.page.keyboard.press('Escape');

        await this.selectAllRegions();

        if (user.country) {
            await this.countryDropdown.waitFor({ state: 'visible', timeout: 10_000 });
            await this.countryDropdown.click();
            await this.page.locator('div.country-dropdown ul.multi-select-checkbox li h4')
                .getByText(user.country, { exact: true }).click();
            await this.clickIfVisible(this.page.locator('div.country-dropdown').getByRole('button', { name: 'Apply' }));
            await this.page.keyboard.press('Escape');
        }

        await this.jobCategoryDropdown.click();
        await this.page.locator('#dropdown-animated h4').getByText(user.jobCategory, { exact: true }).click();

        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.jobTitleInput.fill(user.jobTitle);

        // Left empty — the field is optional, and filling it invalidly
        // (a number that doesn't match whatever country code the portal
        // defaults to) blocks Next, unlike actually leaving it blank.
        // There's no single number/country pairing valid across portals.

        await this.emailInput.pressSequentially(user.email, { delay: 20 });
        await this.confirmEmailInput.waitFor({ state: 'attached' });
        await this.confirmEmailInput.pressSequentially(user.email, { delay: 20 });
    }

    async clickNextStep() {
        await this.nextStepButton.click();
    }

    // stepKey is a portal-agnostic identifier (see StepperStepKey) — the
    // actual displayed label is localized per portal and looked up here,
    // rather than comparing the key itself against the page.
    async expectStepperOnStep(stepKey: StepperStepKey, portal: string) {
        const label = STEPPER_LABELS[portal.toUpperCase()]?.[stepKey];
        if (!label) {
            throw new Error(`No stepper label configured for step "${stepKey}" on portal "${portal}"`);
        }
        await expect(this.activeStepLabel).toHaveText(label);
    }

    // ── Step 2: Access Rights ─────────────────────────────────────
    // The checkbox <input> is permanently display:none (Bootstrap hides the
    // native control, glyph rendered via the label's ::before pseudo-
    // element). A real click on the label isn't possible even with force:
    // force only skips actionability checks (visible/stable/enabled), it
    // still needs a real bounding box to compute where to click, and the
    // label's is always 0x0 — Playwright throws "outside of the viewport"
    // regardless. So: set the property directly and fire the change event
    // Angular's binding listens for. Wrapper visibility (it has real
    // dimensions, unlike the label) is what tells a genuinely available row
    // apart from an RLS-locked one. Returns whether the checkbox ended up
    // checked.
    private async checkCheckbox(checkboxWrapper: Locator): Promise<boolean> {
        const input = checkboxWrapper.locator('input[type="checkbox"]');
        if ((await input.count()) === 0) return false;
        if (await input.isDisabled()) return false;
        if (await input.isChecked()) return true;

        if (!(await checkboxWrapper.isVisible())) return false;

        await input.evaluate((el: HTMLInputElement) => {
            el.checked = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Confirm it actually took — .isChecked() alone is a point-in-time
        // read, not a retrying wait, so it could catch Angular mid-digest;
        // toBeChecked() polls. If it still didn't take, treat this row as
        // unusable and let the caller move on to the next one, rather than
        // reporting a false "granted".
        try {
            await expect(input).toBeChecked({ timeout: 3_000 });
            return true;
        } catch {
            return false;
        }
    }

    async grantAllAvailableAccessRights() {
        // The reports table is populated by an API call after landing on
        // this step — wait for at least one row rather than counting
        // immediately, or portals with a slower fetch race past with 0.
        await this.reportsAccessCheckboxes.first().waitFor({ state: 'attached', timeout: 20_000 }).catch(() => {});

        // One granted report is enough — check the first ungranted, usable one.
        const reportCheckboxes = this.reportsAccessCheckboxes;
        const reportCount = await reportCheckboxes.count();
        let granted = false;
        for (let i = 0; i < reportCount; i++) {
            if (await this.checkCheckbox(reportCheckboxes.nth(i))) {
                granted = true;
                break;
            }
        }

        // Grant every usable content access, not just the portal defaults.
        const contentCheckboxes = this.contentAccessCheckboxes;
        const contentCount = await contentCheckboxes.count();
        for (let i = 0; i < contentCount; i++) {
            if (await this.checkCheckbox(contentCheckboxes.nth(i))) {
                granted = true;
            }
        }

        // Fail here, at the actual cause, instead of a confusing stepper
        // mismatch later — but only if Next is also still disabled. Some
        // portals (e.g. NL) don't require an explicit Reports/Content
        // selection at all when there's a separate Administrative modules
        // section with its own Default items already satisfying validation
        // — Next can be enabled there without us granting anything here.
        if (!granted && !(await this.nextStepButton.isEnabled())) {
            throw new Error(
                'Could not grant any access right — every Reports/Content checkbox was unavailable, and Next is ' +
                'still disabled. If this portal needs a country selected to unlock RLS reports, check the ' +
                '"country" field in SUPPLIER_USER_DATA.'
            );
        }

        // Angular can take a moment to process the checkbox change (and
        // possibly an async validity recompute) before Next reflects it —
        // wait for that explicitly rather than racing a click against it,
        // which is consistent with "Next" intermittently bouncing back to
        // Access Rights.
        await expect(this.nextStepButton).toBeEnabled({ timeout: 5_000 });
        await this.nextStepButton.click();
    }

    // ── Step 3: Summary ──────────────────────────────────────────
    async expectSummaryMatches(user: NewSupplierUser) {
        await expect(this.summarySupplierName).toHaveText(user.supplierName);
        await expect(this.summaryJobCategory).toHaveText(user.jobCategory);
        await expect(this.summaryJobTitle).toHaveText(user.jobTitle);
        await expect(this.summaryFirstName).toHaveText(user.firstName);
        await expect(this.summaryLastName).toHaveText(user.lastName);
        await expect(this.summaryEmail).toHaveText(user.email);
    }

    async confirmCreation() {
        // Same class of issue as Next on Step 1/2 — fail with a clear cause
        // here (e.g. a still-unresolved form validation error from an
        // earlier step) instead of an ambiguous stepper mismatch later.
        await expect(this.createSupplierUserButton).toBeEnabled({ timeout: 10_000 });
        await this.createSupplierUserButton.click();
    }

    // ── Supplier user list ──────────────────────────────────────
    // Shared by expectSupplierUserInList and openUserByFullName: tries each
    // given [searchInputIndex, value] assignment in turn (typing per-input,
    // checking for the row, then clearing on a miss) until one reveals the
    // row, or reports failure so the caller can fall through to a real
    // assertion. Column order (which input is "Supplier" vs. "User") isn't
    // knowable ahead of time — see userListSearchInputs — hence trying
    // multiple assignments rather than a single fixed one.
    private async locateRowViaSearch(matchingRow: Locator, assignments: [number, string][][]): Promise<boolean> {
        const inputs = this.userListSearchInputs;

        for (const assignment of assignments) {
            for (const [index, value] of assignment) {
                // Real per-keystroke typing, not .fill() — the live-search
                // here appears to be driven by individual keyup events (with
                // debounce), which a single programmatic "input" event
                // doesn't trigger.
                await inputs.nth(index).pressSequentially(value, { delay: 50 });
            }

            if (await matchingRow.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
                return true;
            }

            for (const [index] of assignment) {
                await inputs.nth(index).fill('');
            }
        }

        return false;
    }

    // No email column in the list, and name is fixed per portal (only email
    // varies) — match name AND supplier together to rule out a stale row.
    // Searching by supplier name alone isn't enough to guarantee the new
    // row lands on the first page of results — plenty of existing rows
    // already share the same supplier — so both search boxes are filled at
    // once to narrow further, trying both possible column-order assignments.
    async expectSupplierUserInList(user: NewSupplierUser) {
        const fullName = `${user.lastName} ${user.firstName}`;
        const matchingRow = this.userListRows
            .filter({ hasText: fullName })
            .filter({ hasText: user.supplierName });

        const inputCount = await this.userListSearchInputs.count();
        const assignments: [number, string][][] = inputCount >= 2
            ? [[[0, user.supplierName], [1, fullName]], [[0, fullName], [1, user.supplierName]]]
            : Array.from({ length: inputCount }, (_, i) => [[i, user.supplierName]] as [number, string][]);

        if (await this.locateRowViaSearch(matchingRow, assignments)) {
            return;
        }

        // Fall through to a real assertion so the failure message/screenshot
        // is standard, rather than a hand-rolled throw.
        await expect(matchingRow.first()).toBeVisible({ timeout: 5_000 });
    }

    // Locates a row by full name alone (no supplier filter) and opens its
    // details via the "View & Edit" eye icon — only one value is needed
    // here since the seed edit user's name alone is expected to be unique
    // in the list.
    async openUserByFullName(firstName: string, lastName: string) {
        const fullName = `${lastName} ${firstName}`;
        const matchingRow = this.userListRows.filter({ hasText: fullName });

        const inputCount = await this.userListSearchInputs.count();
        const assignments: [number, string][][] = Array.from(
            { length: inputCount }, (_, i) => [[i, fullName]] as [number, string][]
        );

        if (!(await this.locateRowViaSearch(matchingRow, assignments))) {
            // Fall through to a real assertion so the failure message/screenshot
            // is standard, rather than a hand-rolled throw.
            await expect(matchingRow.first()).toBeVisible({ timeout: 5_000 });
        }

        await matchingRow.first().locator('i.fa-eye').click();
    }

    // ── Assertions ───────────────────────────────────────────────
    async expectCreationSuccessful(successMessage: string) {
        await expect(this.page.getByText(successMessage)).toBeVisible({ timeout: 30_000 });
    }
}
