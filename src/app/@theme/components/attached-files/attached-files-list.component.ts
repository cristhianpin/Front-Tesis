import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BaseComponent } from '../../../@core/shared/component/base.component';
import { AttachedFileService } from '../../../@core/shared/service/attached-file.service';

@Component({
  selector: 'ngx-attached-files-list',
  styleUrls: ['./attached-files-list.component.scss'],
  templateUrl: './attached-files-list.component.html',
})
export class AttachedFilesListComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() product: string;

  @Input() trnId: string;

  public cols: any[];
  public objs: any[];

  constructor(private attachedFileService: AttachedFileService) {
    super();
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.logger.debug(`AttachedFilesComponent, product: ${this.product}`);
    this.initTable();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private initTable(): void {
    this.findAll();
    this.cols = [
      {
        field: 'name',
        header: 'Nombre',
        width: '40%',
        type: 'text',
        exportable: false,
        filtrable: true,
        hide: false,
        sortable: true,
        translate: false,
      },
      {
        field: 'attachmentTypeCode',
        header: 'Tipo de documento',
        width: '30%',
        type: 'text',
        exportable: false,
        filtrable: true,
        hide: false,
        sortable: true,
        translate: false,
      },
      {
        field: 'ext',
        header: 'Tipo de archivo',
        width: '30%',
        type: 'text',
        exportable: false,
        filtrable: true,
        hide: false,
        sortable: true,
        translate: false,
      },
      {
        field: 'uploadDate',
        header: 'Fecha Creación',
        width: '25%',
        type: 'date',
        exportable: false,
        filtrable: true,
        hide: false,
        sortable: true,
        translate: false,
      },
      {
        field: 'hasAttachedFile',
        header: '',
        width: '5%',
        type: 'boolean',
        exportable: false,
        filtrable: false,
        hide: false,
        sortable: false,
        translate: true,
      },
    ];
  }

  private findAll(): void {
    this.logger.debug('find document types');
    this.objs = [];
    this.showSpinner = true;
    const attachedFiles$ = this.attachedFileService.findAllByTrnAndProduct(this.trnId, this.product).subscribe((res: any) => {
      if (res) {
        this.objs = res;
        this.logger.debug('document files', this.objs);
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(attachedFiles$);
  }

  public onFileDownload(id: number): void {
    this.logger.debug('onFileDownload');
    const attachedDownload$ = this.attachedFileService.downloadFileById(id).subscribe((res) => {
      this.logger.debug(res);
      if (res) {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.logger.debug('Downloading file...');
        window.open(fileURL);
      }
    });
    this.subscriptions.push(attachedDownload$);
  }
}
