import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { ConfirmDialogConfig } from './util-confirm-dialog.models';
import { UtilConfirmDialogComponent } from './util-confirm-dialog.component';

@Injectable()
export class UtilConfirmDialogService {

  constructor(
    private readonly modalService: BsModalService
  ) { }

  open(config?: ConfirmDialogConfig) {
    const result$ = new Subject<boolean>();
    const modalRef = this.modalService.show(UtilConfirmDialogComponent, { initialState: { config } });
    modalRef.onHide?.subscribe(() => result$.next(!!modalRef.content?.result));
    modalRef.onHidden?.subscribe(() => result$.complete());
    return result$;
  }
}
