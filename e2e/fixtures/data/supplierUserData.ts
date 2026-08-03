export type PortalSupplierUserData = {
  supplierName: string;
  country?: string;
  jobCategory: string;
  jobTitle?: string; // defaults to 'Director' when omitted
  emailDomain: string;
  successMessage: string;
};

// Verified real values per portal (supplier/job category names, and the
// localized confirmation message) — supplied by QA since these differ per
// portal and can't be discovered generically without flaky guessing.
export const SUPPLIER_USER_DATA: Record<string, PortalSupplierUserData> = {
  R3S: { supplierName: '3M', country: 'France', jobCategory: 'Account Manager', emailDomain: 'proton.me', successMessage: 'User created and linked successfully!' },
  AT: { supplierName: '1111 ABB AG', jobCategory: 'Chain', emailDomain: 'proton.me', successMessage: 'Benutzer beim Lieferanten erfolgreich angelegt und verknüpft!' },
  AU: { supplierName: '3M', jobCategory: 'Test Manager', emailDomain: 'proton.me', successMessage: 'User created and linked successfully!' },
  BE: { supplierName: '3M', jobCategory: 'Marketing', emailDomain: 'proton.me', successMessage: 'Utilisateur fournisseur créé et lié avec succès!' },
  CA: { supplierName: '3M CANADA INC.', jobCategory: 'Tester', emailDomain: 'proton.me', successMessage: 'Utilisateur créé avec succès!' },
  CH: { supplierName: '3KV GmbH', jobCategory: 'Automation Tester', emailDomain: 'proton.me', successMessage: 'Utilisateur fournisseur créé et lié avec succès!' },
  DE: { supplierName: '3M', jobCategory: 'Automation Tester', jobTitle: 'CTO', emailDomain: 'proton.me', successMessage: 'Benutzer beim Lieferanten erfolgreich angelegt und verknüpft!' },
  FR: { supplierName: 'ABB', jobCategory: 'Test Manager', emailDomain: 'proton.me', successMessage: 'Utilisateur créé avec succès!' },
  NL: { supplierName: 'ABB', jobCategory: 'Test Manager', emailDomain: 'proton.me', successMessage: 'User created and linked successfully!' },
  SE: { supplierName: 'ABB', jobCategory: 'Test Manager', emailDomain: 'proton.me', successMessage: 'User created and linked successfully!' },
  UK: { supplierName: 'ABB Limited', jobCategory: 'Test Manager', emailDomain: 'proton.me', successMessage: 'User created and linked successfully!' },
  USA: { supplierName: 'ABB INCORPORATED', jobCategory: 'Test Manager', emailDomain: 'proton.me', successMessage: 'User created and linked successfully!' },
};
