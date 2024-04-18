import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first, withLatestFrom } from 'rxjs';

import { UserSessionService } from 'src/user-session';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  readonly loading$ = this.userSessionService.loading$;
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly modalRef: BsModalRef,
    private readonly router: Router,
  ) {}

  login() {
    if (this.form.invalid) return;
    this.userSessionService.login(
      this.form.get('username')?.value as string,
      this.form.get('password')?.value as string,
    );
    this.userSessionService.loading$
      .pipe(
        first((loading) => !loading),
        withLatestFrom(this.userSessionService.error$)
      )
      .subscribe(([_, error]) => {
        if (!!error) alert(JSON.stringify(error)); // TODO
        else {
          this.close();
          this.router.navigate(['/lists']);
        }
      });
  }

  close() {
    this.modalRef.hide();
  }
}
