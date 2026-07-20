import { SUPPLIER_USER_DATA } from './data/supplierUserData';

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

// Email doubles as the login ID, so it must be unique per test run. The
// domain is kept as given (some suppliers only accept certified domains),
// but the local part is kept short and unique — the form silently truncates
// values past ~26 characters, and "nrt.test.signup+<id>" alone exceeds that.
export function generateSupplierUser(portal: string): NewSupplierUser {
  const data = SUPPLIER_USER_DATA[portal.toUpperCase()];
  if (!data) {
    throw new Error(`No supplier user test data configured for portal "${portal}"`);
  }

  const uniqueId = Date.now().toString().slice(-8);

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
