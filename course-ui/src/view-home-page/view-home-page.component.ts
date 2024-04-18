import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, withLatestFrom } from 'rxjs';

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
        if (!!error) alert(JSON.stringify(error)); // TODO
        else this.router.navigate(['/lists']);
      });
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }
}
