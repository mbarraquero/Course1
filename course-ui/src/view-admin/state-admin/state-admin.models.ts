import { ApiRole as Role } from 'src/user-session';
export { apiRoles as allRoles, ApiRole as Role } from 'src/user-session';

export interface UserWithRole {
  id: number;
  username: string;
  roles: Role[],
}