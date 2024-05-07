import { Directive, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { take } from 'rxjs';

import { ApiRole } from './user-session.models';
import { UserSessionService } from './user-session.service';

@Directive({
  selector: '[appForRoles]'
})
export class ForRolesDirective implements OnInit {
  @Input() appForRoles: ApiRole[] = [];

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<unknown>,
    private readonly service: UserSessionService
  ) { }

  ngOnInit() {
    this.service.loaded$
      .pipe(take(1))
      .subscribe((loaded) => {
        if (loaded) {
          this.updateViewContainer();
          return;
        }
        this.service.init();
        this.service.loaded$
          .pipe(take(1))
          .subscribe(() => this.updateViewContainer());
      });
  }

  private updateViewContainer() {
    this.service.userRoles$
      .pipe(take(1))
      .subscribe((userRoles) => {
        if (userRoles.some((userRole) => this.appForRoles.includes(userRole)))
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        else
          this.viewContainerRef.clear();
      });
  }
}
