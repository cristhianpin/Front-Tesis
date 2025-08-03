import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-authentication',
  template: `<router-outlet></router-outlet>`,
})
export class AuthenticationComponent implements OnInit {
  returnUrl: string;

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
}
