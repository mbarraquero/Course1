import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, withLatestFrom } from 'rxjs';

import { ErrorService } from 'src/error/error.service';
import { UserSessionService } from 'src/user-session';

@Component({
  selector: 'app-view-home-page',
  templateUrl: './view-home-page.component.html',
  styleUrls: ['./view-home-page.component.scss']
})
export class ViewHomePageComponent {
  showRegisterForm = false;
  readonly loading$ = this.userSessionService.loading$;
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly errorService: ErrorService,
    private readonly router: Router,
  ) {}

  register() {
    if (this.registerForm.invalid) return;
    this.userSessionService.register(
      this.registerForm.get('username')?.value as string,
      this.registerForm.get('password')?.value as string,
    );
    this.userSessionService.loading$
      .pipe(
        first((loading) => !loading),
        withLatestFrom(this.userSessionService.error$)
      )
      .subscribe(([_, error]) => {
        if (!!error) this.errorService.handleError(error as HttpErrorResponse);
        else this.router.navigate(['/members']);
      });
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }
}
