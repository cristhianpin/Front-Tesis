import { Component, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../../@core/shared/component/base-form.component';

@Component({
  selector: 'ngx-pending-statement',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss'],
})
export class PendingComponent extends BaseFormComponent {
  @Input() pendingPayments: any[] = [];
  constructor(@Optional() activeDialog: NbDialogRef<never>, private router: Router, private activatedRoute: ActivatedRoute) {
    super(activeDialog);
  }
}
