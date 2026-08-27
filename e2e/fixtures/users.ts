export type Environment = 'qa' | 'uat' | 'ppr';
export type UserRole = 'superAdmin' | 'systemAdmin' | 'supplierUser';

export type TestUser = {
  email: string;
  password: string;
  role: UserRole;
};

// Reads credentials from environment variables for a given portal and role.
// Throws if the required EMAIL or PASSWORD variables are missing.
function getUser(
  portal: string,
  role: UserRole
): TestUser {
  const key = `${portal}_${roleToEnvKey(role)}`;
  const email    = process.env[`${key}_EMAIL`];
  const password = process.env[`${key}_PASSWORD`];

  if (!email || !password) {
    throw new Error(
      `Missing credentials for ${portal} / ${role}. ` +
      `Check your .env.${process.env.TEST_ENV} file.`
    );
  }

  return { email, password, role };
}

function roleToEnvKey(role: UserRole): string {
  const map: Record<UserRole, string> = {
    superAdmin:   'SUPER_ADMIN',
    systemAdmin:  'SYSTEM_ADMIN',
    supplierUser: 'SUPPLIER_USER',
  };
  return map[role];
}

// Lazy-loaded — credentials are resolved at call time, not at module load time.
// This ensures the .env file has already been loaded by the time the values are read.
export function getCredentials(
  portal: string,
  role: UserRole
): TestUser {
  return getUser(portal.toUpperCase(), role);
}