export type StepperStepKey = 'account-details' | 'access-rights' | 'summary' | 'confirmation';

// A label can be a single string, or (for portals where the rendered
// language depends on session/account state rather than a fixed default,
// e.g. NL) a list of acceptable translations.
type StepperLabel = string | string[];

// Verified real values per portal — supplied by QA, since the stepper labels
// are localized per portal language and can't be discovered generically
// without flaky guessing.
export const STEPPER_LABELS: Record<string, Record<StepperStepKey, StepperLabel>> = {
  R3S: { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  AT:  { 'account-details': 'Angaben des Lieferanten', 'access-rights': 'Zugriffsrechte', summary: 'Übersicht', confirmation: 'Bestätigung' },
  AU:  { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  BE:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  CA:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  CH:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  DE:  { 'account-details': 'Angaben des Lieferanten', 'access-rights': 'Zugriffsrechte', summary: 'Übersicht', confirmation: 'Bestätigung' },
  FR:  { 'account-details': 'Détails du fournisseur', 'access-rights': "Droits d'accès", summary: 'Résumé', confirmation: 'Confirmation' },
  // NL supports both English and Dutch (portals.ts: languages: ['en', 'nl']).
  // Observed directly: a live NL run rendered the whole stepper in English
  // ("Access Rights", "Summary") even though access-rights/summary here were
  // still set Dutch-only — so this isn't a per-field difference, it's the
  // portal/session rendering entirely in one language or the other.
  // 'account-details' has only ever been observed as English, so it's left
  // as-is; the other three accept either, pairing each field's already-
  // recorded Dutch value with the English one now confirmed live.
  NL:  {
    'account-details': 'Account details',
    'access-rights': ['Access Rights', 'Toegangsrechten'],
    summary: ['Summary', 'Samenvatting'],
    confirmation: ['Confirmation', 'Bevestiging'],
  },
  SE:  { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  UK:  { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
  USA: { 'account-details': 'Account details', 'access-rights': 'Access Rights', summary: 'Summary', confirmation: 'Confirmation' },
};
