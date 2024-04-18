import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs';

import { UserSessionService } from 'src/user-session';

import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  readonly loggedIn$ = this.userSessionService.loggedIn$;
  readonly username$ = this.userSessionService.userName$;

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly modalService: BsModalService,
    private readonly router: Router,
  ) {}

  openLoginModal() {
    this.modalService.show(LoginModalComponent);
  }

  logout() {
    this.userSessionService.logout();
    this.userSessionService.loggedIn$
      .pipe(first((loggedIn) => !loggedIn))
      .subscribe(() => this.router.navigate(['/home']));
  }
}
