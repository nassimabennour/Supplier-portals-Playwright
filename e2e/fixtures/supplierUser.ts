import { SUPPLIER_USER_DATA } from './data/supplierUserData';

// Emails and job titles only need to be unique per test run, not globally
// stable — the current timestamp's last 8 digits is enough entropy for that.
function generateUniqueId(): string {
  return Date.now().toString().slice(-8);
}

export type NewSupplierUser = {
  supplierName: string;
  country?: string;
  jobCategory: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  successMessage: string;
};

// Manually pre-created in every portal for the edit scenario — name is
// fixed (used to look the user up), everything else is arbitrary.
// Used by: supplier-user-edit.steps.ts (lookup), generateEditedSupplierUser().
export const SEED_EDIT_USER = {
  firstName: 'user',
  lastName: 'toedit',
};

export type EditedSupplierUserFields = {
  jobTitle: string;
  firstName: string;
  lastName: string;
};

// Job Category/phone excluded (no verified per-portal values). First/last
// name are pinned to SEED_EDIT_USER so the seed user stays findable by name
// next run. Job title is made unique per run so a no-op save can't
// accidentally "pass". Email is left untouched — editing it triggers a
// per-supplier "domain not certified" check that isn't reliably clearable
// everywhere (only R3S/USA confirmed so far).
// Used by: supplier-user-edit.steps.ts → SupplierUserEditPage.fillDetails().
export function generateEditedSupplierUser(): EditedSupplierUserFields {
  const uniqueId = generateUniqueId();

  return {
    jobTitle: `Edited Director ${uniqueId}`,
    firstName: SEED_EDIT_USER.firstName,
    lastName: SEED_EDIT_USER.lastName,
  };
}

// Email doubles as the login ID, so it must be unique per test run. The
// domain is kept as given (some suppliers only accept certified domains),
// but the local part is kept short and unique — the form silently truncates
// values past ~26 characters, and "nrt.test.signup+<id>" alone exceeds that.
export function generateSupplierUser(portal: string): NewSupplierUser {
  const data = SUPPLIER_USER_DATA[portal.toUpperCase()];
  if (!data) {
    throw new Error(`No supplier user test data configured for portal "${portal}"`);
  }

  const uniqueId = generateUniqueId();

  return {
    supplierName: data.supplierName,
    country: data.country,
    jobCategory: data.jobCategory,
    jobTitle: data.jobTitle ?? 'Director',
    firstName: 'Automation',
    lastName: 'Testing',
    successMessage: data.successMessage,
    email: `t${uniqueId}@${data.emailDomain}`,
  };
}
