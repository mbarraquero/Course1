import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';

import { areArrayEqual } from 'src/util-helpers';

import { StateAdminFacade, UserWithRole } from '../state-admin';
import { UserRolesModalComponent } from '../user-roles-modal/user-roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  readonly loading$ = this.adminFacade.loading$;
  readonly users$ = this.adminFacade.allUsers$;

  constructor(
    private readonly adminFacade: StateAdminFacade,
    private readonly modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.adminFacade.init();
  }

  openRolesModal(user: UserWithRole) {
    const initialState = {
      username: user.username,
      selectedRoles: [...user.roles],
    };
    const modalRef = this.modalService.show(
      UserRolesModalComponent,
      {
        class: 'modal-dialog-centered',
        initialState
      }
    );
    modalRef.content?.submit$
      .pipe(take(1))
      .subscribe((roles) => {
        if (areArrayEqual([...user.roles], roles)) return;
        this.adminFacade.updateUserRoles({ ...user, roles });
      });
  }

  trackByFn(_: number, user: UserWithRole) {
    return user.id;
  }
}
