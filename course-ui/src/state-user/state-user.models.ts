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
}