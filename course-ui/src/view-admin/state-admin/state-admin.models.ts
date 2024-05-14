import { ApiRole as Role } from 'src/api-models';
export { apiRoles as allRoles, ApiRole as Role } from 'src/api-models';

export interface UserWithRole {
  id: number;
  username: string;
  roles: Role[],
}

export interface PhotoForApproval {
    id: number;
    username: string;
    url: string;
}