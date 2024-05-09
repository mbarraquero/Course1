import { ApiPageParams } from './pagination.models';

export interface ApiMemberDto {
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
};

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

export interface ApiUserParams extends ApiPageParams {
  // currentUsername: string; // unused
  gender?: string;
  minAge?: number;
  maxAge?: number;
  orderBy?: ApiUserOrderBy;
};

export interface ApiLikeDto {
  id: number;
  userName: string;
  photoUrl: string;
  age: number;
  knownAs: string;
  city: string;
};

export type ApiLikesPredicate = 'liked' | 'likedBy';

export interface ApiLikesParams extends ApiPageParams {
  // userId: number; // unused
  predicate: ApiLikesPredicate;
};

export interface ApiMessageDto {
  id: number;
  senderId: number;
  senderUsername: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientUsername: string;
  recipientPhotoUrl: string;
  content: string;
  dateRead?: string;
  messageSent: string;
};

export type ApiMessagesContainer = 'Inbox' | 'Outbox' | 'Unread';

export interface ApiCreateMessageDto {
    recipientUsername: string;
    content: string;
}

export interface ApiNewMessageReceivedDto {
  username: string;
  knownAs: string;
}
