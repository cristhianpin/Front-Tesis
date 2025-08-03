import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { IShareInfo } from '../../../@core/shared/model/share-info.model';
import { ShareInfoService } from '../../../@core/shared/service/share-info.service';

@Component({
  selector: 'ngx-share-dialog',
  styleUrls: ['./share-dialog.component.scss'],
  templateUrl: './share-dialog.component.html',
})
export class ShareDialogComponent extends BaseFormComponent implements OnInit, OnDestroy {
  @Input() trnId?: string;
  @Input() trnType?: string;
  public loading = false;

  public submitted = false;

  private obj: IShareInfo = {};

  constructor(@Optional() activeDialog: NbDialogRef<any>, private shareInfoService: ShareInfoService) {
    super(activeDialog);
  }

  ngOnInit(): void {
    this.printInputVals();
    this.initValues();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  private printInputVals(): void {
    super.printInputValues();
    this.logger.debug('input trnId : ', this.trnId);
    this.logger.debug('input trnType : ', this.trnType);
  }

  private initValues(): void {
    this.objForm = this.createForm();
  }

  private createForm(): FormGroup {
    const myForm = new FormGroup({
      emails: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ),
      trnId: new FormControl({
        value: this.trnId,
        disabled: false,
      }),
      trnType: new FormControl({
        value: this.trnType,
        disabled: false,
      }),
    });

    return myForm;
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.objForm.invalid) {
      return;
    }
    this.obj = this.objForm.value;
    this.logger.debug('obj to share : ', this.obj);
    this.shareTrn();
  }

  private shareTrn(): void {
    const email$ = this.shareInfoService.shareTrn(this.obj).subscribe((res) => {
      if (res) {
        super.closeWithResp(res);
      }
    });
    this.subscriptions.push(email$);
  }

  public onClose(): void {
    super.close();
  }
}
