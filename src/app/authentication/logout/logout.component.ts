import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, NbLogoutComponent, NbTokenService } from '@nebular/auth';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent extends NbLogoutComponent implements OnInit {
  protected logger: NGXLogger;

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    protected tokenService: NbTokenService,
  ) {
    super(service, options, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  logout(strategy: string): void {
    super.logout(strategy);
    this.tokenService.clear();
    localStorage.clear();
  }
}
