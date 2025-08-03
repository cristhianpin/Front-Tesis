import { Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { ITerms } from '../../../@core/shared/model/terms.model';
import { TermsService } from '../../../@core/shared/service/terms.service';

@Component({
  selector: 'ngx-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['terms-dialog.component.scss'],
})
export class TermsDialogComponent extends BaseFormComponent implements OnInit, OnDestroy {
  public obj: ITerms;
  constructor(@Optional() activeDialog: NbDialogRef<any>, private termsService: TermsService) {
    super(activeDialog);
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.printInputVals();
    this.initValues();
    this.getTerms();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private printInputVals(): void {
    super.printInputValues();
  }

  private initValues(): void {
    this.obj = {} as ITerms;
  }

  private getTerms(): void {
    this.logger.debug('getTerms');
    this.showSpinner = true;
    const terms$ = this.termsService.findByEnabled().subscribe((res: ITerms) => {
      if (res) {
        this.obj = res;
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(terms$);
  }

  public onSubmit(): void {
    this.logger.debug('onSubmit');
  }
}
