import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { FileUpload } from 'primeng/fileupload';
import { BaseComponent } from '../../../@core/shared/component/base.component';
import { IAttachmentType } from '../../../@core/shared/model/attachment-type.model';
import { AttachmentTypeService } from '../../../@core/shared/service/attachment-type.service';

@Component({
  selector: 'ngx-attached-files',
  styleUrls: ['./attached-files.component.scss'],
  templateUrl: './attached-files.component.html',
})
export class AttachedFilesComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() modalStyle?: string;
  @Input() modalSeverity?: string;

  @Input() product: string;
  @Input() attachmentTypes: IAttachmentType[];
  @Output() changeFiles = new EventEmitter<any>();

  public selectedTypeDocument: any;

  public showLabel = true; // todo: use this in file component to show drag and drop message

  @Input() previewfiles: any[] = [];

  public files: any[] = [];

  @ViewChild('fu') fileUpload: FileUpload;

  constructor(@Optional() public activeDialog: NbDialogRef<any>, private attachmentTypeService: AttachmentTypeService) {
    super();
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.logger.debug(`AttachedFilesComponent, product: ${this.product}`);
    this.logger.debug('this.previewfiles: ', this.previewfiles);

    if (this.previewfiles && this.previewfiles.length > 0) {
      this.previewfiles.forEach((prevfile) => {
        this.files.push(prevfile);
      });
    }

    //this.findTypes(this.product);
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private findTypes(product: string): void {
    this.logger.debug('find document types');
    const attachmentTypes$ = this.attachmentTypeService.findAllByTrnType(product, true).subscribe((res: any) => {
      if (res) {
        this.attachmentTypes = res;
        this.logger.debug('document types', this.attachmentTypes);
      }
    });
    this.subscriptions.push(attachmentTypes$);
  }

  public onSelect(event: any): boolean {
    this.logger.debug(`onSelect : ${event}`);
    this.logger.debug(`onSelect selectedTypeDocument: ${this.selectedTypeDocument}`);
    return false;
  }

  public onRemove(event: any): void {
    this.logger.debug('onRemove : ', event);
    this.logger.debug(this.files.length);
    if (this.files.length <= 0) {
      this.showLabel = true;
    }
  }

  public onClear(event: any): void {
    this.logger.debug(`onClear : ${event}`);
  }

  public onFileUpload(data: { files }, fu: any): void {
    this.logger.debug('onFileUpload');
    const file = data.files[data.files.length - 1];

    /*
    if (!this.selectedTypeDocument) {
      super.showToastWithIcon('Debe seleccionar el tipo de documento', 'Alerta', 'warning');
      data.files.pop();
    }
    

    file.typeDoc = this.selectedTypeDocument;
    file.attachmentTypeCode = this.selectedTypeDocument.code;
    */

    if (file) {
      this.files.push(file);
      //this.changeFiles.emit(this.files);
      this.showLabel = false;
      this.selectedTypeDocument = undefined;
    }
  }

  public getSizeInMegaBytes(file: File): number {
    return file ? file.size / 1000000 : 0;
  }

  public removeFile(file: File, uploader: FileUpload): void {
    const index = uploader.files.indexOf(file);
    uploader.remove(null, index);
    delete this.files[index];
  }

  public close(): void {
    this.activeDialog.close();
  }

  public closeWithResp(res: any): void {
    this.activeDialog.close(res);
  }

  public onSubmit(): void {
    const processFiles = [];
    let error = false;
    this.files.forEach((file) => {
      if (file.typeDoc) {
        file.attachmentTypeCode = file.typeDoc.code;
        processFiles.push(file);
      } else {
        error = true;
        super.showToastWithIcon('Debe seleccionar el tipo de documento para el documento ' + file.name, 'Alerta', 'warning');
      }
    });

    if (!error) {
      this.files = processFiles;

      this.closeWithResp(this.files);
    }
  }
}
