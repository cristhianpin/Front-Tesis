import { Component } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-internal-server-error',
  styleUrls: ['./internal-server-error.component.scss'],
  templateUrl: './internal-server-error.component.html',
})
export class InternalServerErrorComponent {
  constructor(private menuService: NbMenuService) {}

  goToHome(): void {
    this.menuService.navigateHome();
  }
}
