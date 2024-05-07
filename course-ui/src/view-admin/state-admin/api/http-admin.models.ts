import { ApiRole } from 'src/user-session';

export interface ApiUsersWithRoles {
  id: number;
  username: string;
  roles: ApiRole[],
}