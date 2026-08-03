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

// The seed supplier user manually created in every portal specifically for
// the edit scenario — same name everywhere, everything else about it
// (supplier, job category, ...) is arbitrary and not relied upon.
export const SEED_EDIT_USER = {
  firstName: 'editest',
  lastName: 'editestt',
};

// Distinct from generateSupplierUser's default "Automation"/"Testing" name —
// the delete scenario needs to find and open the *one* user it just
// created without matching every leftover "Automation Testing" row from
// every other creation-feature run (which never deletes its user).
export const DELETE_TEST_NAME = {
  firstName: 'todelete',
  lastName: 'todeletee',
};

export type EditedSupplierUserFields = {
  jobTitle: string;
  firstName: string;
  lastName: string;
};

// Job Category and phone number are deliberately left out here: Job Category
// has no second QA-verified value per portal yet, and phone has no verified
// country/number pairing per portal — same reason SupplierUserPage.
// fillAccountDetails already leaves phone blank during creation.
//
// Firstname/Lastname are pinned to SEED_EDIT_USER rather than varied: the
// edit scenario finds this user by that exact name on every run, so changing
// it here would make the seed user impossible to find next time. Job title
// is still made unique per run — otherwise a no-op save could coincidentally
// "pass" against a value left over from the previous run.
//
// Email is deliberately never generated or touched here: editing it triggers
// a "domain not certified" validation that's scoped per supplier, and the
// seed user's actual supplier differs per portal (and isn't under test
// control) — neither proton.me nor outlook.com clears it on UK, for example.
// Only R3S/USA were confirmed to accept an edited email at all. Until
// someone with admin access confirms a domain that's actually certified for
// each portal's seed user, editing email isn't covered by this scenario.
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
