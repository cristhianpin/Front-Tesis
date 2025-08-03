import { Component } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-forbidden',
  styleUrls: ['./forbidden.component.scss'],
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {
  constructor(private menuService: NbMenuService) {}

  goToHome(): void {
    this.menuService.navigateHome();
  }
}
