import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, switchMap, take, tap, withLatestFrom } from 'rxjs';

import { ApiLikeDto, ApiMemberDto, ApiMessageDto } from 'src/api-models';
import { ErrorService } from 'src/error';
import { MessageHubService, PresenceHubService } from 'src/hub';
import { UserSessionService } from 'src/user-session';

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
          UserActions.listenToUsersPresence(),
          UserActions.listenToUserMessages(),
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
          withLatestFrom(this.presenceHub.onlineUsers$),
          map(([{ result, pagination }, onlineUsers]) => UserActions.loadPagedUsersSuccess({
            users: result.map((apiUser) => ({
              id: apiUser.id,
              userName: apiUser.userName,
              knownAs: apiUser.knownAs,
              photoUrl: apiUser.photoUrl,
              city: apiUser.city,
              online: onlineUsers.includes(apiUser.userName),
            } as User)),
            pagination,
            onlineUsers,
          })),
          catchError((error) => of(UserActions.loadPagedUsersFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );
  
  listenToUsersPresence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.listenToUsersPresence),
      switchMap(() =>
        this.presenceHub.onlineUsers$.pipe(
          withLatestFrom(
            this.store.pipe(select(UserSelectors.getSelectedUser)),
            this.store.pipe(select(UserSelectors.getAllUsers)),
          ),
          map(([onlineUsers, selectedUser, allUsers]) => {
            const users = allUsers.map((user) => ({
              ...user,
              online: onlineUsers.includes(user.userName),
            }));
            if (selectedUser) selectedUser = {
              ...selectedUser,
              online: onlineUsers.includes(selectedUser.userName),
            };
            return UserActions.updateOnlineUsers({ onlineUsers, users, selectedUser });
          })
        )
      )
    )
  );

  listenToUsersPresenceToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.listenToUsersPresence),
        tap(() => {
          this.presenceHub.userOnline$.subscribe((username) =>
            this.toastr.success(`${username} is online`));
          this.presenceHub.userOffline$.subscribe((username) =>
            this.toastr.warning(`${username} is offline`));
        }),
      ),
    { dispatch: false },
  );

  listenToUserMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.listenToUserMessages),
      switchMap(() => 
        this.presenceHub.newMessageReceived$.pipe(
          map(({ username, knownAs }) => UserActions.showMessageNotification({ username, knownAs }))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ userName }) =>
        this.api.getUserByName(userName).pipe(
          withLatestFrom(this.presenceHub.onlineUsers$),
          map(([apiUser, onlineUsers]) => UserActions.loadUserSuccess({
            user: this.toUser(apiUser, onlineUsers)
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

  // loadUserMessagesThread$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.loadUserMessagesThread),
  //     switchMap(({ userName }) =>
  //       this.api.getMessagesThread(userName).pipe(
  //         map((apiMessages) => UserActions.loadUserMessagesThreadSuccess({
  //           messages: apiMessages.map((apiMessage) => this.toMessage(apiMessage)),
  //         })),
  //         catchError((error) => of(UserActions.loadUserMessagesThreadFailure({
  //           error: this.errorService.getErrorMessage(error)
  //         })))
  //       )
  //     )
  //   )
  // );

  loadUserMessagesThread$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserMessagesThread),
      switchMap(({ userName }) => {
        this.messageHub.createConnection(
          this.sessionService.getToken() ?? '',
          userName,
        );
        return this.messageHub.messageThread$
          .pipe(
            map((apiMessages) => UserActions.userMessagesThreadUpdate({
              messages: apiMessages.map((apiMessage) => this.toMessage(apiMessage)),
            })),
            catchError((error) => of(UserActions.userMessagesThreadFailure({
              error: this.errorService.getErrorMessage(error)
            })))
          );
      })
    )
  );

  // sendMessage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.sendMessage),
  //     withLatestFrom(
  //       this.store.pipe(select(UserSelectors.getMessages)),
  //     ),
  //     switchMap(([{ userName, message }, messages]) =>
  //       this.api.sendMessage(userName, message).pipe(
  //         map((apiMessage) => {
  //           const updatedMessages = [
  //             ...messages ?? [],
  //             this.toMessage(apiMessage),
  //           ]
  //           return UserActions.sendMessageSuccess({ messages: updatedMessages })
  //         }),
  //         catchError((error) => of(UserActions.sendMessageFailure({
  //           error: this.errorService.getErrorMessage(error)
  //         })))
  //       )
  //     )
  //   )
  // );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.sendMessage),
      switchMap(({ userName, message }) =>
        this.messageHub.sendMessage(userName, message).pipe(
          map(() => UserActions.sendMessageSuccess()),
          catchError((error) => of(UserActions.sendMessageFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    ),
  );

  deleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteMessage),
      withLatestFrom(
        this.store.pipe(select(UserSelectors.getMessages)),
      ),
      switchMap(([{ message }, messages]) =>
        this.api.deleteMessage(message.id).pipe(
          map(() => UserActions.deleteMessageSuccess({
            messages: messages?.filter((msg) => msg.id !== message.id) ?? []
          })),
          catchError((error) => of(UserActions.deleteMesageFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  showMessageNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.showMessageNotification),
        tap(({ username, knownAs }) => {
          this.toastr.info(`${knownAs} sent you a message. Click here to open it`)
            .onTap
            .pipe(take(1))
            .subscribe(() => this.router.navigate([`/members/${username}`], { queryParams: { tab: 'Messages' } }))
        }),
      ),
    { dispatch: false },
  );

  stopUserMessagesThread$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.stopUserMessagesThread),
        tap(() => this.messageHub.stopConnection())
      ),
    { dispatch: false },
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
          UserActions.userMessagesThreadFailure,
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
    private readonly messageHub: MessageHubService,
    private readonly presenceHub: PresenceHubService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  private toUser(apiUser: ApiMemberDto, onlineUsers?: string[]) {
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
        isApproved: apiPhoto.isApproved,
      })),
      online: onlineUsers?.includes(apiUser.userName),
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
