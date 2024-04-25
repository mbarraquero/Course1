export interface ApiLoginDto {
  username: string;
  password: string;
}

export interface ApiRegisterDto {
  username: string;
  knownAs: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  country: string;
  password: string;
}

export interface ApiUserDto {
  username: string;
  knownAs: string;
  token: string;
  photoUrl: string;
}