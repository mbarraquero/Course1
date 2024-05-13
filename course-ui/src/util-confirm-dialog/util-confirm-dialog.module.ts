import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UtilConfirmDialogComponent } from './util-confirm-dialog.component';
import { UtilConfirmDialogService } from './util-confirm-dialog.service';

@NgModule({
  declarations: [
    UtilConfirmDialogComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    UtilConfirmDialogService
  ]
})
export class UtilConfirmDialogModule { }
