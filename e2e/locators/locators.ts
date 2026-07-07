import { PortalLocators } from '../config/portals';

const PORTAL_LOCATORS: Record<string, PortalLocators> = {
  R3S: {
    login: {
      connectToViewText: /Connect to VIEW/i,
    },
  },
};

export function getLocators(portal: string): PortalLocators {
  return PORTAL_LOCATORS[portal] ?? { login: {} };
}
