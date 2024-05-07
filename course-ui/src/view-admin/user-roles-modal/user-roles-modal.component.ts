import { Component, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { Role, allRoles } from '../state-admin';

@Component({
  selector: 'app-user-roles-modal',
  templateUrl: './user-roles-modal.component.html',
  styleUrls: ['./user-roles-modal.component.scss']
})
export class UserRolesModalComponent implements OnDestroy {
  username: string = '';
  selectedRoles: Role[] = [];
  readonly availableRoles: Role[] = Object.values(allRoles);

  private readonly submitSubj = new Subject<Role[]>();
  readonly submit$ = this.submitSubj.asObservable();

  constructor(
    private readonly modalRef: BsModalRef
  ) {}

  ngOnDestroy() {
    this.submitSubj.complete();
  }

  check(role: Role) {
    if (this.selectedRoles.includes(role))
      this.selectedRoles = this.selectedRoles.filter((selected) => selected !== role);
    else
      this.selectedRoles.push(role);
  }

  submit() {
    this.submitSubj.next(this.selectedRoles);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
