import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, Subject, take, takeUntil, withLatestFrom } from 'rxjs';

import { Photo, StateUserFacade, User } from 'src/state-user';
import { UserSessionService } from 'src/user-session';
import { UtilFileUploadService } from 'src/util-file-upload';

@Component({
  selector: 'app-members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.scss']
})
export class MembersEditComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnload($event: Event) {
    if (this.aboutForm.dirty) {$event.returnValue = true;}
  }

  readonly loading$ = this.userFacade.loading$;
  readonly member$ = this.userFacade.selectedUser$;
  readonly aboutForm = this.getNewAboutForm();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userFacade: StateUserFacade,
    private readonly sessionService: UserSessionService,
    private readonly toastr: ToastrService,
    private readonly fileUploadService: UtilFileUploadService,
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.sessionService.userName$.pipe(take(1)).subscribe((userName) => {
      if (!userName) return;
      this.userFacade.loadUser(userName);
    });
    this.userFacade.selectedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((member) => this.updateAboutForm(member));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save() {
    const currentValue = this.aboutForm.value;
    this.userFacade.updateUser({
      introduction: currentValue.introduction || '',
      lookingFor: currentValue.lookingFor || '',
      interests: currentValue.interests || '',
      city: currentValue.city || '',
      country: currentValue.country || ''
    });
    this.loading$
      .pipe(
        first((loading) => !loading),
        withLatestFrom(
          this.member$,
          this.userFacade.error$,
        )
      )
      .subscribe(([_, updatedMember, error]) => {
        if (!error) {
          this.updateAboutForm(updatedMember);
          this.toastr.success('Profile updated successfully');
        }
      })
  }

  setMainPhoto(photo: Photo) {
    if (photo.isMain) return;
    this.userFacade.setMainPhoto(photo);
  }

  deletePhoto(photo: Photo) {
    if (photo.isMain) return;
    this.userFacade.deletePhoto(photo);
  }

  openPhotoUploadDialog() {
    this.fileUploadService.openModal$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newPhoto) => this.userFacade.photoAdded(newPhoto));
  }

  private getNewAboutForm() {
    return this.formBuilder.group({
      introduction: [''],
      lookingFor: [''],
      interests: [''],
      city: [''],
      country: [''],
    });
  }

  private updateAboutForm(member?: User) {
    this.aboutForm.reset({
      introduction: member?.introduction,
      lookingFor: member?.lookingFor,
      interests: member?.interests,
      city: member?.city,
      country: member?.country,
    });
  }
}
