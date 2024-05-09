export const apiRoles = ['Member', 'Admin', 'Moderator'] as const;
export type ApiRole = typeof apiRoles[number];

export interface ApiUsersWithRoles {
  id: number;
  username: string;
  roles: ApiRole[],
}