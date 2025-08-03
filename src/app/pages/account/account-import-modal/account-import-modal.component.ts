import { Component, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { FileUpload } from 'primeng/fileupload';
import { BaseComponent } from '../../../@core/shared/component/base.component';
import { AccountService } from '../../../@core/shared/service/account.service';

@Component({
  selector: 'ngx-account-import-modal',
  styleUrls: ['./account-import-modal.component.scss'],
  templateUrl: './account-import-modal.component.html',
})
export class AccountImportModalComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() modalStyle?: string;
  @Input() modalSeverity?: string;
  @Input() code: string;

  public file: any = null;
  public files: any[] = [];
  public acceptedFiles: string = '.xls, .xlsx';

  @ViewChild('fu') fileUpload: FileUpload;
  public showLabel = true; // todo: use this in file component to show drag and drop message
  public isAlertError = false;
  public messageAlertError = '';

  constructor(@Optional() public activeDialog: NbDialogRef<any>, private accountService: AccountService) {
    super();
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  public onSelect(event: any): boolean {
    this.logger.debug(`onSelect : ${event}`);
    return false;
  }

  public onRemove(event: any): void {
    this.logger.debug('onRemove : ', event);
    if (this.files.length <= 0) {
      this.showLabel = true;
    }
  }

  public onClear(event: any): void {
    this.logger.debug(`onClear : ${event}`);
  }

  public onFileUpload(data: { files }, fu: any): void {
    this.logger.debug('onFileUpload');
    this.file = data.files[data.files.length - 1];

    this.logger.debug('onFileUpload, antes de');

    this.logger.debug('onFileUpload, despues de');
    //this.logger.debug('onFileUpload, var:', processId);

    this.showLabel = false;
  }

  public getSizeInMegaBytes(file: File): number {
    return file ? file.size / 1000000 : 0;
  }

  public removeFile(file: File, uploader: FileUpload): void {
    this.logger.debug('removeFile');
    if (this.file) {
      const index = uploader.files.indexOf(file);
      uploader.remove(null, index);
      this.logger.debug('removeFile in');
      this.file = null;
    }
  }

  public close(): void {
    this.activeDialog.close();
  }

  public closeWithResp(res: any): void {
    this.activeDialog.close(res);
  }

  public onSubmit(): void {
    this.showSpinner = true;

    const formData: FormData = new FormData();
    formData.append('file', this.file);

    // 1 create process definition
    const accounts$ = this.accountService.uploadFile(formData).subscribe((res: any) => {
      this.logger.debug('resUploadFile: ', res);
      if (res) {
        if (res.data.isError) {
          this.isAlertError = true;
          this.messageAlertError = res.data.message;
          this.showSpinner = false;
        } else {
          setTimeout(() => {
            this.showSpinner = false;
            this.closeWithResp(res);
            //super.handleSuccessfulEditObj(res);
            // this.close();
          }, 1000);
        }
      }
    });
    this.subscriptions.push(accounts$);
  }
}
