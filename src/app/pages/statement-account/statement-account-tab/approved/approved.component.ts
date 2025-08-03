import { Component, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../../@core/shared/component/base-form.component';

@Component({
  selector: 'ngx-approved-statement',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss'],
})
export class ApprovedComponent extends BaseFormComponent {
  @Input() approvedPayments: any[] = [];
  constructor(@Optional() activeDialog: NbDialogRef<never>, private router: Router, private activatedRoute: ActivatedRoute) {
    super(activeDialog);
  }
}
