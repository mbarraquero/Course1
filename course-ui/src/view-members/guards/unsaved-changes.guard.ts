import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { UtilConfirmDialogService } from 'src/util-confirm-dialog';

import { MembersEditComponent } from '../members-edit/members-edit.component';

export const unsavedChangesGuard: CanDeactivateFn<MembersEditComponent> = (component: MembersEditComponent) => {
  const confirmService = inject(UtilConfirmDialogService);

  if (component.aboutForm.dirty) {
    return confirmService.open();
  }
  return true;
};
