import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, withLatestFrom } from 'rxjs';

import { ErrorService } from 'src/error/error.service';
import { UserSessionService } from 'src/user-session';
import { UtilValidators } from 'src/util-validators';

@Component({
  selector: 'app-view-home-page',
  templateUrl: './view-home-page.component.html',
  styleUrls: ['./view-home-page.component.scss']
})
export class ViewHomePageComponent {
  readonly loading$ = this.userSessionService.loading$;
  registerForm = this.getRegisterForm();
  showRegisterForm = false;
  todayMinus18Yr: Date;

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly errorService: ErrorService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {
    this.todayMinus18Yr = new Date();
    this.todayMinus18Yr.setFullYear(this.todayMinus18Yr.getFullYear() - 18);
  }

  register() {
    if (this.registerForm.invalid) return;
    this.userSessionService.register({
      username: this.registerForm.get('username')?.value as string,
      knownAs: this.registerForm.get('knownAs')?.value as string,
      gender: this.registerForm.get('gender')?.value as string,
      dateOfBirth: this.removeTZ(this.registerForm.get('dateOfBirth')?.value ?? undefined) as string,
      city: this.registerForm.get('city')?.value as string,
      country: this.registerForm.get('country')?.value as string,
      password: this.registerForm.get('password')?.value as string,
    });
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

  private getRegisterForm() {
    const registerForm = this.formBuilder.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: UtilValidators.ConfirmField('password', 'confirmPassword')
      },
    );
    return registerForm;
  }

  private removeTZ(dateStr?: string) {
    if (!dateStr) return dateStr;
    const date = new Date(dateStr);
    return new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()))
      .toISOString()
      .slice(0, 10);
  }
}
