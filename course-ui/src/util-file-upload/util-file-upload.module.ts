import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';

import { UtilFileUploadComponent } from './util-file-upload.component';
import { UtilFileUploadService } from './util-file-upload.service';

@NgModule({
  declarations: [
    UtilFileUploadComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
  ],
  providers: [
    UtilFileUploadService
  ],
})
export class UtilFileUploadModule {}
