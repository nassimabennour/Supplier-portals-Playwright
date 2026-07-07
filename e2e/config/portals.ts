export type Environment = 'qa' | 'uat' | 'ppr';

export type PortalFeatures = {
  news: boolean;
  documentation: boolean;
  activeDirectory: boolean;
  supplierDirectory: boolean;
  digitalMarketing: boolean;
  staticReports: boolean;
  purchaseDocuments: boolean;
  logisticDocuments: boolean;
  operationalMarketing: boolean;
  securedDataExchange: boolean;
  masquerade: boolean;
  multiLanguage: boolean;
  massManagementSupplierUser: boolean;
  massManagementRexelUser: boolean;
};

export type PortalLocators = {
  login: {
    connectToViewText?: RegExp; // optional — R3S only
  };
}

export type PortalConfig = {
  name: string;
  baseURL: Record<Environment, string>;
  language: string;
  languages: string[];
  features: PortalFeatures;
};

export const PORTALS: Record<string, PortalConfig> = {
  R3S: {
    name: 'R3S',
    baseURL: {
      qa:   'https://r3s.suppliers-qa.rexel.com',
      uat:  'https://r3s.suppliers-uat.rexel.com',
      ppr:  'https://www-r3s.suppliers-ppr.rexel.com'
    },
    language: 'en',
    languages: ['en'],
    features: {
      news: true,
      documentation: true,
      activeDirectory: true,
      supplierDirectory: true,
      digitalMarketing: true,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: true,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: false,
      massManagementRexelUser: false,
    },
  },
  FR: {
    name: 'FR',
    baseURL: {
      qa:   'https://rfr.suppliers-qa.rexel.com',
      uat:  'https://fr.suppliers-uat.rexel.com',
      ppr:  'https://www-fr.suppliers-ppr.rexel.com',
    },
    language: 'fr',
    languages: ['fr'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: true,
      purchaseDocuments: true,
      logisticDocuments: true,
      operationalMarketing: true,
      securedDataExchange: true,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  UK: {
    name: 'UK',
    baseURL: {
      qa:   'https://ruk.suppliers-qa.rexel.com',
      uat:  'https://uk.suppliers-uat.rexel.com',
      ppr:  'https://www-ruk.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['en'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  BE: {
    name: 'BE',
    baseURL: {
      qa:   'https://rbe.suppliers-qa.rexel.com',
      uat: 'https://be.suppliers-uat.rexel.com',
      ppr:  'https://www-rbe.view-ppr.rexel.com',
    },
    language: 'fr',
    languages: ['fr', 'en', 'nl'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: true,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  USA: {
    name: 'USA',
    baseURL: {
      qa:   'https://rus.suppliers-qa.rexel.com',
      uat:   'https://us.suppliers-uat.rexel.com',
      ppr:  'https://www-rau.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['en'],
    features: {
      news: true,
      documentation: true,
      activeDirectory: true,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  CH: {
    name: 'CH',
    baseURL: {
      qa:   'https://rem.suppliers-qa.rexel.com/',
      uat:  'https://ch.suppliers-uat.rexel.com',
      ppr:  'https://www-rch.view-ppr.rexel.com',
    },
    language: 'de',
    languages: ['fr', 'de', 'it'],
    features: {
      news: false,
      documentation: true,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: true,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  DE: {
    name: 'DE',
    baseURL: {
      qa:   'https://rde.suppliers-qa.rexel.com',
      uat:  'https://rde.suppliers-uat.rexel.com',
      ppr:  'https://www-rde.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['en', 'de'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: true,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  AT: {
    name: 'AT',
    baseURL: {
      qa:   'https://rat.suppliers-qa.rexel.com',
      uat:  'https://at.suppliers-uat.rexel.com',
      ppr:  'https://www-rat.view-ppr.rexel.com',
    },
    language: 'de',
    languages: ['de'],
    features: {
      news: true,
      documentation: true,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  AU: {
    name: 'AU',
    baseURL: {
      qa:   'https://rau.suppliers-qa.rexel.com',
      uat:  'https://au.suppliers-uat.rexel.com',
      ppr:  'https://www-rau.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['en'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: true,
      supplierDirectory: true,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  CA: {
    name: 'CA',
    baseURL: {
      qa:   'https://rca.suppliers-qa.rexel.com',
      uat:  'https://ca.suppliers-uat.rexel.com',
      ppr:  'https://www-rca.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['fr', 'en'],
    features: {
      news: false,
      documentation: true,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: true,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
  SE: {
    name: 'SE',
    baseURL: {
      qa:   'https://rse.suppliers-qa.rexel.com',
      uat:  'https://se.suppliers-uat.rexel.com',
      ppr:  'https://www-rse.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['en'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: false,
      massManagementSupplierUser: false,
      massManagementRexelUser: true,
    },
  },
  NL: {
    name: 'NL',
    baseURL: {
      qa:   'https://rnl.suppliers-qa.rexel.com',
      uat:  'https://rnl.suppliers-uat.rexel.com',
      ppr:  'https://www-rnl.view-ppr.rexel.com',
    },
    language: 'en',
    languages: ['en', 'nl'],
    features: {
      news: false,
      documentation: false,
      activeDirectory: false,
      supplierDirectory: false,
      digitalMarketing: false,
      staticReports: false,
      purchaseDocuments: false,
      logisticDocuments: false,
      operationalMarketing: false,
      securedDataExchange: false,
      masquerade: true,
      multiLanguage: true,
      massManagementSupplierUser: true,
      massManagementRexelUser: true,
    },
  },
};

// Helper — get portals where a specific feature is active
export function getPortalsWithFeature(
  feature: keyof PortalFeatures
): PortalConfig[] {
  return Object.values(PORTALS).filter((p) => p.features[feature]);
}