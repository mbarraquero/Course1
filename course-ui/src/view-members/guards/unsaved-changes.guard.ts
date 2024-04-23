import { CanDeactivateFn } from '@angular/router';
import { MembersEditComponent } from '../members-edit/members-edit.component';

export const unsavedChangesGuard: CanDeactivateFn<MembersEditComponent> = (component: MembersEditComponent) => {
  if (component.aboutForm.dirty) {
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
  }
  return true;
};
