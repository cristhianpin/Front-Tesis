import { Component, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../../@core/shared/component/base-form.component';

@Component({
  selector: 'ngx-account-statement',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent extends BaseFormComponent {
  @Input() paymentDetails: any[] = [];
  constructor(@Optional() activeDialog: NbDialogRef<never>, private router: Router, private activatedRoute: ActivatedRoute) {
    super(activeDialog);
  }
}
