import { Injectable } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Photo } from 'src/state-user';
import { UserSessionService } from 'src/user-session';

import { UtilFileUploadComponent } from './util-file-upload.component';

@Injectable()
export class UtilFileUploadService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly modalService: BsModalService,
    private readonly toastr: ToastrService,
  ) {}

  openModal$() {
    const newPhoto$ = new Subject<Photo>(); //can review later if more endpoints appear
    const modalRef = this.modalService
      .show(UtilFileUploadComponent, { class: 'modal-xl' });
    if (modalRef.content)
      modalRef.content.uploader = this.initializeUploader(newPhoto$);
    modalRef.onHidden?.subscribe(() =>
      newPhoto$.complete());
    return newPhoto$;
  }

  private initializeUploader(newPhoto$: Subject<Photo>) {
    const uploader = new FileUploader({
      url: this.apiUrl + 'Users/add-photo', //can review later if more endpoints appear
      headers: [
        { name: 'Authorization', value: `Bearer ${this.userSessionService.getToken()}`},
      ],
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: false,
      maxFileSize: 10*1024*1024,
    });
    uploader.onAfterAddingFile = (item: FileItem) => item.withCredentials = false;
    uploader.onSuccessItem = (item: FileItem, response: string) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        newPhoto$.next(photo);
        uploader.removeFromQueue(item);
        this.toastr.success(`${item.file.name} uploaded successfully`);
      }
    };
    uploader.onErrorItem = (_, response: string, status: number) => {
      this.toastr.error(response, status.toString());
    }
    return uploader;
  }
}
