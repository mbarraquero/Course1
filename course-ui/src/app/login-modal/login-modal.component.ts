import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { first, withLatestFrom } from 'rxjs';

import { ErrorService } from 'src/error/error.service';
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
    private readonly toastr: ToastrService,
    private readonly errorService: ErrorService,
    private readonly router: Router,
    private readonly modalRef: BsModalRef,
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
        if (!!error) {
          if (error.status === 401) this.toastr.error('Invalid username or password');
          else this.errorService.handleError(error as HttpErrorResponse);
        }
        else {
          this.close();
          this.router.navigate(['/members']);
        }
      });
  }

  close() {
    this.modalRef.hide();
  }
}
