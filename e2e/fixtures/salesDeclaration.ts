import path from 'path';
import { generateUniqueId } from './supplierUser';

// Only R3S exposes this feature — enforced via $testInfo.skip() in the
// feature's Background step.
export const SALES_DECLARATION_PORTAL = 'R3S';

// A real sample export from the app. The document title after upload is
// derived from this file's base name.
export const SALES_DECLARATION_FILE_PATH = path.join(__dirname, 'files', 'sample-sales-declaration.xls');
export const SALES_DECLARATION_FILE_TITLE = 'sample-sales-declaration';

// Only the extension matters here — content is irrelevant.
export const INVALID_FILE_TYPE_PATH = path.join(__dirname, 'files', 'invalid-type.txt');

// 3MB, over the app's 2MB-per-file limit.
export const OVERSIZED_FILE_PATH = path.join(__dirname, 'files', 'oversized-declaration.xls');

// Unique per run so it never collides with campaigns left behind by
// earlier or parallel runs.
export function generateCampaignName(): string {
  return `automation-${generateUniqueId()}`;
}

// Carries the campaign name from create steps to review steps (separate
// .steps.ts files, same scenario).
let currentCampaignName = '';

export function setCurrentCampaignName(name: string): void {
  currentCampaignName = name;
}

export function getCurrentCampaignName(): string {
  return currentCampaignName;
}
