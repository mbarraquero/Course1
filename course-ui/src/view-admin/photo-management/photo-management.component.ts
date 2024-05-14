import { Component, OnDestroy } from '@angular/core';
import { take } from 'rxjs';

import { StateUserFacade } from 'src/state-user';

import { PhotoForApproval, StateAdminFacade } from '../state-admin';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.scss']
})
export class PhotoManagementComponent implements OnDestroy {
  readonly loading$ = this.adminFacade.loading$;
  readonly photos$ = this.adminFacade.photosToModerate$;
  private mainPhotoUpdated = false;

   constructor(
     private readonly adminFacade: StateAdminFacade,
     private readonly userFacade: StateUserFacade,
   ) { }

   ngOnDestroy() {
     if (!this.mainPhotoUpdated) return;
     this.userFacade.init();
   }

   approve(photo: PhotoForApproval) {
     this.adminFacade.approvePhotoToModerate(photo);
     this.userFacade.allUsers$.pipe(take(1)).subscribe((allUsers) => {
       const user = allUsers.find((user) => user.userName === photo.username);
       if (!user || !!user.photoUrl) return;
       this.mainPhotoUpdated = true;
     });
   }

   reject(photo: PhotoForApproval) {
     this.adminFacade.rejectPhotoToModerate(photo);
  }
}
