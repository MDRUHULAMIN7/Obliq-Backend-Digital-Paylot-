export const USER_ROLE = {
  admin: 'admin',
  manager: 'manager',
  agent: 'agent',
  customer: 'customer',
} as const;

export const UserStatus = ['active', 'suspended', 'banned'] as const;
