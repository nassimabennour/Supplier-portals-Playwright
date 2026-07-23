export type StepperStepKey = 'account-details' | 'access-rights' | 'summary' | 'confirmation';

// Verified real values per portal — supplied by QA, since the stepper labels
// are localized per portal language and can't be discovered generically
// without flaky guessing.
export const STEPPER_LABELS: Record<string, Record<StepperStepKey, string>> = {
  R3S: { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  AT:  { 'account-details': 'Angaben des Lieferanten', 'access-rights': 'Zugriffsrechte', summary: 'Übersicht', confirmation: 'Bestätigung' },
  AU:  { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  BE:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  CA:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  CH:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  DE:  { 'account-details': 'Angaben des Lieferanten', 'access-rights': 'Zugriffsrechte', summary: 'Übersicht', confirmation: 'Bestätigung' },
  FR:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  NL:  { 'account-details': 'Account details', 'access-rights': 'Toegangsrechten', summary: 'Samenvatting', confirmation: 'Bevestiging' },
  SE:  { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  UK:  { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  USA: { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
};
