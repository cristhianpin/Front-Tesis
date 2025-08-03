import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';

@Component({
  selector: 'ngx-table-export-dialog',
  templateUrl: './table-export-dialog.component.html',
  styleUrls: ['table-export-dialog.component.scss'],
})
export class TableExportDialogComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  // public format = 'pdf';
  public format = 'xls';
  public separator = this.CSV_SEPARATOR;
  public separatorDisabled = true;

  constructor(@Optional() activeDialog: NbDialogRef<any>) {
    super(activeDialog);
    this.logger.debug('constructor');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.printInputVals();
  }

  ngAfterViewInit(): void {
    this.logger.debug('ngAfterViewInit');
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private printInputVals(): void {
    super.printInputValues();
  }

  public formatSelected(evt: any): void {
    this.separatorDisabled = true;
    if (evt === 'csv') {
      this.separatorDisabled = false;
    }
  }

  public onSubmit(): void {
    this.logger.debug('onSubmit');
    const response = {
      format: this.format,
      separator: this.separator,
    };
    super.handleSuccessfulEditObj(response);
  }
}
