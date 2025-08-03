import { Component, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../../@core/shared/component/base-form.component';

@Component({
  selector: 'ngx-customer-statement',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent extends BaseFormComponent {
  @Input() customer: any;
  @Input() property: any;
  @Input() financial: any;
  @Input() agreements: any;
  constructor(@Optional() activeDialog: NbDialogRef<never>, private router: Router, private activatedRoute: ActivatedRoute) {
    super(activeDialog);
  }
}
