import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-util-file-upload',
  templateUrl: './util-file-upload.component.html',
  styleUrls: ['./util-file-upload.component.scss']
})
export class UtilFileUploadComponent {
  hasBaseDropZoneOver = false;
  uploader?: FileUploader;

  constructor(
    private readonly modalRef: BsModalRef,
  ) {}

  fileOverBase(e: Event) {
    this.hasBaseDropZoneOver = !!e;
  }

  close() {
    this.modalRef.hide();
  }
}
