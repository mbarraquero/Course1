export interface ApiLoginDto {
  username: string;
  password: string;
}

export interface ApiRegisterDto {
  username: string;
  password: string;
}

export interface ApiUserDto {
  username: string;
  token: string;
  photoUrl: string;
}