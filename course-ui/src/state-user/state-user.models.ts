import { ApiUserOrderBy } from './api/http-user.models';
export {
  ApiUserOrderBy as UserOrderBy,
  ApiLikesPredicate as LikesPredicate,
} from './api/http-user.models';

export interface User {
  id: number;
  userName: string;
  photoUrl: string;
  age: number;
  knownAs: string;
  created: string;
  lastActive: string;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photos: Photo[];
}

export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
}

export interface UsersFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  orderBy?: ApiUserOrderBy;
}

export interface UserUpdate {
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
}