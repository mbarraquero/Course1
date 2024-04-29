import { ApiPageParams } from 'src/pagination';

export interface ApiMemberDto
{
  id: number;
  userName: string;
  photoUrl: string;
  age: number;
  knownAs: string;
  created: string;
  lastActive: string;
  gender: string;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photos: ApiPhotoDto[];
}

export interface ApiPhotoDto {
  id: number;
  url: string;
  isMain: boolean;
}

export interface ApiMemberUpdateDto {
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
}

export type ApiUserOrderBy = 'created' | 'lastActive';

export interface GetUsersParams {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  pageNumber: number;
  pageSize: number;
  orderBy?: ApiUserOrderBy;
}

export interface ApiUserParams extends ApiPageParams {
  // currentUsername: string; // unused
  gender?: string;
  minAge?: number;
  maxAge?: number;
  orderBy?: ApiUserOrderBy;
};