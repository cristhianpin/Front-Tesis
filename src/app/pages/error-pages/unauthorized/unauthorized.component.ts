import { Component } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-unauthorized',
  styleUrls: ['./unauthorized.component.scss'],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  constructor(private menuService: NbMenuService) {}

  goToHome(): void {
    this.menuService.navigateHome();
  }
}
