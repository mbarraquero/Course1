import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

import { ErrorService } from 'src/error';
import { UserSessionService } from 'src/user-session';

import { ApiLikeDto, ApiMemberDto, ApiMessageDto } from './api/http-user.models';
import { HttpUserService } from './api/http-user.service';

import * as UserActions from './state-user.actions';
import { Message, Photo, User } from './state-user.models';
import {
  UserPartialState,
  defaultMaxAge,
  defaultMinAge,
  defaultOrderBy,
  defaultPagination,
  getDefaultGender
} from './state-user.reducer';
import * as UserSelectors from './state-user.selectors';

@Injectable()
export class UserEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.init),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getPagination)),
        this.sessionService.userGender$,
      ),
      switchMap(([_, pagination, gender]) => {
        const defaultFilters = {
          gender: getDefaultGender(gender ?? ''),
          minAge: defaultMinAge,
          maxAge: defaultMaxAge,
          orderBy: defaultOrderBy,
        };
        return [
          UserActions.loadPagedUsers({
            pageNumber: pagination.currentPage,
            pageSize: pagination.itemsPerPage,
            filters: defaultFilters,
          }),
          UserActions.setDefaultFilters({ defaultFilters }),
        ]
      })
    )
  );

  goToUsersPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.goToUsersPage),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getPagination)),
        this.store.pipe(select(UserSelectors.getFilters))
      ),
      map(([{ pageNumber }, pagination, filters]) =>
        UserActions.loadPagedUsers({
          pageNumber,
          pageSize: pagination.itemsPerPage,
          filters,
        })
      )
    )
  );

  setFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setFilters),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getPagination)),
      ),
      map(([{ filters }, pagination]) =>
        UserActions.loadPagedUsers({
          pageNumber: defaultPagination.currentPage,
          pageSize: pagination.itemsPerPage,
          filters,
        })
      )
    )
  );

  resetFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.resetFilters),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getPagination)),
        this.store.pipe(select(UserSelectors.getDefaultFilters)),
      ),
      map(([_, pagination, defaultFilters]) =>
        UserActions.loadPagedUsers({
          pageNumber: defaultPagination.currentPage,
          pageSize: pagination.itemsPerPage,
          filters: defaultFilters ?? {},
        })
      )
    )
  );

  loadPagedUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadPagedUsers),
      switchMap(({ pageNumber, pageSize, filters }) =>
        this.api.getUsers({
          pageNumber,
          pageSize,
          gender: filters.gender,
          minAge: filters.minAge,
          maxAge: filters.maxAge,
          orderBy: filters.orderBy,
        }).pipe(
          map(({ result, pagination }) => UserActions.loadPagedUsersSuccess({
            users: result.map((apiUser) => ({
              id: apiUser.id,
              userName: apiUser.userName,
              knownAs: apiUser.knownAs,
              photoUrl: apiUser.photoUrl,
              city: apiUser.city,
            } as User)),
            pagination,
          })),
          catchError((error) => of(UserActions.loadPagedUsersFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ userName }) =>
        this.api.getUserByName(userName).pipe(
          map((apiUser) => UserActions.loadUserSuccess({
            user: this.toUser(apiUser)
          })),
          catchError((error) => of(UserActions.loadUserFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ userUpdate }) => {
        const apiUserUpdate = {
          introduction: userUpdate.introduction,
          lookingFor: userUpdate.lookingFor,
          interests: userUpdate.interests,
          city: userUpdate.city,
          country: userUpdate.country,
        };
        return this.api.updateUser(apiUserUpdate).pipe(
          map((apiUser) => UserActions.updateUserSuccess({
            user: this.toUser(apiUser)
          })),
          catchError((error) => of(UserActions.updateUserFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        );
      })
    )
  );

  photoAdded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.photoAdded),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getSelectedUser))
      ),
      switchMap(([{ photo }, user]) => {
        if (photo.isMain) return [this.onMainPhotoUpdated(photo, user)];
        else return [];
      })
    )
  );

  setMainPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setMainPhoto),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getSelectedUser))
      ),
      switchMap(([{ photo }, user]) =>
        this.api.setMainPhoto(photo.id).pipe(
          map(() => this.onMainPhotoUpdated(photo, user)),
          catchError((error) => of(UserActions.setMainPhotoFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  private onMainPhotoUpdated(photo: Photo, user?: User) {
    const photoUrl = photo.url;
    const photos = user?.photos.map((currentPhoto) => ({
      ...currentPhoto,
      isMain: currentPhoto.id === photo.id,
    })) ?? [];
    this.sessionService.onUserPhotoUrlUpdated(photoUrl);
    return UserActions.setMainPhotoSuccess({ photoUrl, photos });
  }

  deletePhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deletePhoto),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getSelectedUser))
      ),
      switchMap(([{ photo }, user]) =>
        this.api.deletePhoto(photo.id).pipe(
          map(() => {
            const photos = user?.photos.filter((currentPhoto) =>
              currentPhoto.id !== photo.id
            ) ?? [];
            return UserActions.deletePhotoSuccess({ photos });
          }),
          catchError((error) => of(UserActions.deletePhotoFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  loadUserLikes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserLikes),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getLikesPagination)),
      ),
      map(([{ predicate }, { itemsPerPage }]) =>
        UserActions.loadPagedUserLikes({
          pageNumber: defaultPagination.currentPage,
          pageSize: itemsPerPage,
          predicate,
        })
      )
    )
  );

  goToUserLikesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.goToUserLikesPage),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getLikesPagination)),
      ),
      map(([{ pageNumber, predicate }, { itemsPerPage }]) =>
        UserActions.loadPagedUserLikes({
          pageNumber,
          pageSize: itemsPerPage,
          predicate,
        })
      )
    )
  );

  loadPagedUserLikes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadPagedUserLikes),
      switchMap(({ pageNumber, pageSize, predicate }) =>
        this.api.getLikesByPredicate(pageNumber, pageSize, predicate).pipe(
          map(({ result, pagination }) => UserActions.loadPagedUserLikesSuccess({
            likesUsers: result.map((apiLikeUser) => this.toLikeUser(apiLikeUser)),
            likesPagination: pagination,
          })),
          catchError((error) => of(UserActions.loadPagedUserLikesFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  like$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.like),
      switchMap(({ user }) =>
        this.api.like(user.userName).pipe(
          map(() => UserActions.likeSuccess()),
          catchError((error) => of(UserActions.likeFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  loadUserMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserMessages),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getMessagesPagination)),
      ),
      map(([{ container }, { itemsPerPage }]) =>
        UserActions.loadPagedUserMessages({
          pageNumber: defaultPagination.currentPage,
          pageSize: itemsPerPage,
          container,
        })
      )
    )
  );

  goToUserMessagesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.goToUserMessagesPage),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getMessagesPagination)),
      ),
      map(([{ pageNumber, container }, { itemsPerPage }]) =>
        UserActions.loadPagedUserMessages({
          pageNumber,
          pageSize: itemsPerPage,
          container,
        })
      )
    )
  );

  loadPagedUserMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadPagedUserMessages),
      switchMap(({ pageNumber, pageSize, container }) =>
        this.api.getMessagesByContainer(pageNumber, pageSize, container).pipe(
          map(({ result, pagination }) => UserActions.loadPagedUserMessagesSuccess({
            messages: result.map((apiMessage) => this.toMessage(apiMessage)),
            messagesPagination: pagination,
          })),
          catchError((error) => of(UserActions.loadPagedUserMessagesFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  loadUserMessagesThread$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserMessagesThread),
      switchMap(({ userName }) =>
        this.api.getMessagesThread(userName).pipe(
          map((apiMessages) => UserActions.loadUserMessagesThreadSuccess({
            messages: apiMessages.map((apiMessage) => this.toMessage(apiMessage)),
          })),
          catchError((error) => of(UserActions.loadUserMessagesThreadFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.sendMessage),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getMessages)),
      ),
      switchMap(([{ userName, message }, messages]) =>
        this.api.sendMessage(userName, message).pipe(
          map((apiMessage) => {
            const updatedMessages = [
              ...messages ?? [],
              this.toMessage(apiMessage),
            ]
            return UserActions.sendMessageSuccess({ messages: updatedMessages })
          }),
          catchError((error) => of(UserActions.sendMessageFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  deleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteMesage),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getMessages)),
      ),
      switchMap(([{ message }, messages]) =>
        this.api.deleteMessage(message.id).pipe(
          map(() => UserActions.sendMessageSuccess({
            messages: messages?.filter((msg) => msg.id !== message.id) ?? []
          })),
          catchError((error) => of(UserActions.deleteMesageFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  genericError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          UserActions.loadPagedUsersFailure,
          UserActions.loadUserFailure,
          UserActions.updateUserFailure,
          UserActions.setMainPhotoFailure,
          UserActions.deletePhotoFailure,
          UserActions.loadPagedUserLikesFailure,
          UserActions.likeFailure,
          UserActions.loadPagedUserMessagesFailure,
          UserActions.loadUserMessagesThreadFailure,
          UserActions.sendMessageFailure,
          UserActions.deleteMesageFailure,
          // drop here errors to be generically handled
        ),
        tap(({ error }) => this.errorService.handleError(error as HttpErrorResponse))
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<UserPartialState>,
    private readonly api: HttpUserService,
    private readonly errorService: ErrorService,
    private readonly sessionService: UserSessionService,
  ) {}

  private toUser(apiUser: ApiMemberDto) {
    return {
      id: apiUser.id,
      userName: apiUser.userName,
      photoUrl: apiUser.photoUrl,
      age: apiUser.age,
      knownAs: apiUser.knownAs,
      created: apiUser.created,
      lastActive: apiUser.lastActive,
      introduction: apiUser.introduction,
      lookingFor: apiUser.lookingFor,
      interests: apiUser.interests,
      city: apiUser.city,
      country: apiUser.country,
      photos: apiUser.photos.map((apiPhoto) => ({
        id: apiPhoto.id,
        url: apiPhoto.url,
        isMain: apiPhoto.isMain,
      }))
    } as User;
  }

  private toLikeUser(apiLikeUser: ApiLikeDto) {
    return {
      id: apiLikeUser.id,
      userName: apiLikeUser.userName,
      photoUrl: apiLikeUser.photoUrl,
      age: apiLikeUser.age,
      knownAs: apiLikeUser.knownAs,
      city: apiLikeUser.city,
    } as User;
  }

  private toMessage(apiMessage: ApiMessageDto) {
    return {
      id: apiMessage.id,
      sender: {
        id: apiMessage.senderId,
        username: apiMessage.senderUsername,
        photoUrl: apiMessage.senderPhotoUrl,
      },
      recipient: {
        id: apiMessage.recipientId,
        username: apiMessage.recipientUsername,
        photoUrl: apiMessage.recipientPhotoUrl,
      },
      content: apiMessage.content,
      messageSent: apiMessage.messageSent,
      dateRead: apiMessage.dateRead,
    } as Message;
  }
}
