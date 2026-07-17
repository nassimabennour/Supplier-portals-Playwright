export type NewSupplierUser = {
  supplier: string;
  country: string;
  jobCategory: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
};

// Email doubles as the login ID, so it must be unique per test run.
// Kept short (well under ~26 chars) since the form silently truncates longer values.
export function generateSupplierUser(): NewSupplierUser {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    supplier: '3M',
    country: 'Belgium',
    jobCategory: 'Digital Dpt Local',
    jobTitle: 'testeur',
    firstName: 'test',
    lastName: 'testett',
    email: `t${uniqueId}@test.com`,
  };
}
