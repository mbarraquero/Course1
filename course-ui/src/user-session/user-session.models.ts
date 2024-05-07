export const apiRoles = ['Member', 'Admin', 'Moderator'] as const;
export type ApiRole = typeof apiRoles[number];