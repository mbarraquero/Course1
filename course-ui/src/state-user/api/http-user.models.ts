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