import { NbComponentStatus } from '@nebular/theme';
import { BaseComponent } from './base.component';

import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TableExportDialogComponent, TablePreferenceDialogComponent } from '../../../@theme/components';
import { ServiceInjector } from '../injector/service-injector.module';
import { ITablePreference } from '../model/table-preference.model';
import { TablePreferenceService } from '../service/table-preference.service';
import { Table } from 'primeng/table';

declare const require: any;

export class BaseListComponent extends BaseComponent {
  public objs: any[];

  protected exportColumns: any[];

  public _dt: Table;

  public selectedObj: any;
  public selectedObjs: any[];

  public componentName: string;
  public totalRecords: number;
  public totalLastRecords: number;

  protected loadingStyle: string;
  protected loadingStyleSpin: string;
  public buttonLoadingStyle: string;
  public loadingFiles: boolean;
  public actionDisabled: boolean;
  public deleteActionDisabled = true;
  public approveActionDisabled = true;
  public multiSelectRecordDisabled = true;

  public loading: boolean;

  // table
  public cols: any[];
  public selectedCols: any[];
  public tableName: string;
  public showFilter: boolean;
  public globalFilterBtnDisabled = true;
  public filterFieldGlobal: string;

  public tablePreference: ITablePreference;
  // table

  private tablePreferenceService: TablePreferenceService;

  constructor(private _componentName: string) {
    super();
    this.componentName = _componentName;
    this.tableName = `${this.componentName}Table`;
    this.tablePreferenceService = ServiceInjector.get(TablePreferenceService);
  }

  protected initBaseValues(): void {
    this.showSpinner = false;
    this.loadingStyle = 'fa fa-sync';
    this.loadingStyleSpin = 'fa fa-sync fa-spin';
    this.buttonLoadingStyle = this.loadingStyle;
    this.showFilter = false;
    this.tablePreference = {} as ITablePreference;
    this.initActions();
    this.removeTableSelectionState();
  }

  private initActions(): void {
    this.disableActionButtons();
  }

  private removeTableSelectionState(): void {
   
    localStorage.removeItem(this.tableName);
  }

  protected setSelectedObj(obj: any): void {
    if (this.selectedObjs) {
      this.selectedObj = obj;
      if (obj) {
        this.selectedObjs[0] = obj;
      } else {
        this.selectedObjs = obj;
      }
    }
  }

  protected handleCRUDResponse(response: any, operation: string): void {
    this.logger.debug(`handleCRUDResponse, Operation: ${operation} - response: `, response);
    let severity = 'success';
    let title = 'message.title.success';
    let body = 'message.body.create-success';
    if (operation === 'U') {
      this.setSelectedObj(response.object);
    } else if (operation === 'D') {
      this.setSelectedObj(null);
      this.handleActionButtons();
      severity = 'danger';
      title = 'message.title.info';
      body = 'message.body.delete-success';
    }

    if (response.details) {
      title = response.key;
      body = response.details;
    }

    super.showToast(severity, title, body);
  }

  protected showCRUDToast(response: any, operation: string, modelName: string, status: NbComponentStatus): void {
    let msgTitle = '';
    let msgBody = '';
    switch (operation) {
      case 'C':
        msgTitle = 'message.title.create-success';
        msgBody = `Se ha creado ${modelName}`;
        break;
      case 'U':
        msgTitle = 'message.title.update-success';
        msgBody = `Se ha actualizado ${modelName}`;
        this.setSelectedObj(response);
        break;
      case 'D':
        msgTitle = 'message.title.delete-success';
        msgBody = `Se ha eliminado ${modelName}`;
        this.setSelectedObj(null);
        this.handleActionButtons();
        break;
      default:
        break;
    }
    super.showToastWithIcon(msgBody, msgTitle, status);
  }

  protected successResponse(response: any, operation: string, title: string, body: string): void {
    this.logger.debug('After close modal, res : ', response);
    if (operation === 'U') {
      this.setSelectedObj(response);
    } else if (operation === 'D') {
      this.setSelectedObj(null);
      this.handleActionButtons();
    }
    super.showToastWithIcon(body, title, 'success');
  }

  protected initTableProperties(): void {
    this.logger.debug('initTableProperties');
    this.selectedCols = this.cols;
    this.selectedCols = this.selectedCols.filter((col) => col.hide != true);
    this.setExportableCols(this.cols);
   
    this.tablePreferenceService.findByTableName(this.tableName).subscribe((res) => {
      if (res) {
        console.log(res);
        this.tablePreference = res.data;
        this.logger.debug('initTableProperties, tablePreference : ', this.tablePreference);
        if (this.tablePreference.selected_cols) {
          this.selectedCols = JSON.parse(this.tablePreference.selected_cols);
          this.setExportableCols(this.selectedCols);
        }
      }
    });
  }

  private setExportableCols(cols: any[]): void {
    this.logger.debug('setExportableCols');
    this.exportColumns = cols
      .filter((col) => col.exportable)
      .map((col) => ({
        title: col.header,
        dataKey: col.field,
        type: col.type,
        translate: col.translate,
      }));
    this.logger.info('exportCols: ', this.exportColumns);
  }

  private getExportFileName(): string {
    return this.componentName + '_export_' + new Date().getTime();
  }

  public exportPdf(): void {
    this.logger.debug('exportPdf');
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text(this.componentName, 11, 8);
    doc.setFontSize(12);
    doc.setTextColor(99);
    const headers = this.formatPDFHeaders();
    const records = this.formatPDFRecords();
    autoTable(doc, {
      head: headers,
      body: records,
      theme: 'grid',
      didDrawCell: (data) => {
        // this.logger.debug(data.column.index)
      },
    });
    const pages = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    const pag = this.getTranslation('pag');
    const _of = this.getTranslation('of');
    for (let j = 1; j < pages + 1; j++) {
      const horizontalPos = pageWidth - 10;
      const verticalPos = pageHeight - 10;
      doc.setPage(j);
      doc.text(`${pag} ${j} ${_of} ${pages}`, horizontalPos, verticalPos, {
        align: 'right',
      });
    }
    // doc.output('dataurlnewwindow') //open pdf in new tab
    doc.save(this.getExportFileName() + this.PDF_EXTENSION);
  }

  private formatPDFHeaders(): any[] {
    this.logger.debug('formatHeaders');
    const headers = [[]];
    this.exportColumns.forEach((exportCol) => headers[0].push(this.getTranslation(exportCol.title)));
    return headers;
  }

  private formatPDFRecords(): any[] {
    this.logger.debug('formatRecords');
    const records = [];
    let tuple = [];

    this.objs.forEach((obj) => {
      this.exportColumns.forEach((exportCol) => {
        let value = obj[exportCol.dataKey];
        if (exportCol.type === 'date') {
          value = this.getDateFormatted(value);
        } else if (exportCol.type === 'numeric') {
          const currCode = obj['currencyTxt'];
          value = this.getCurrencyFormatted(value, currCode);
        } else if (exportCol.type === 'date-short') {
          value = this.getDateFormatted(value);
        }
        if (exportCol.translate) {
          value = this.getTranslation(`${value}`);
        }
        tuple.push(value);
      });
      records.push(tuple);
      tuple = [];
    });
    return records;
  }

  public exportExcel(dt): void {
    this.logger.debug('exportExcel');
    const exportRecords = this.fillExportRecords(dt, this.EXCEL_TYPE);
    const worksheet = XLSX.utils.json_to_sheet(exportRecords);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer);
  }

  private saveAsExcelFile(buffer: any): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, this.getExportFileName() + this.EXCEL_EXTENSION);
  }


  private fillExportRecords(dt, format: string): any[] {
    this.logger.debug('fillExportObjs');
    let objsFilter = [];
    const records = [];
    let tuple = {};

    this.logger.debug('dt: ', dt);

    if (dt.filteredValue) {
      this.logger.debug(dt.filteredValue);
      this.logger.debug(dt.filteredValue.length);
      objsFilter = dt.filteredValue;
    } else {
      this.logger.debug(dt.value);
      this.logger.debug(dt.value.length);
      objsFilter = dt.value;
    }

    objsFilter.forEach((obj) => {
      this.exportColumns.forEach((exportCol) => {
        let value = obj[exportCol.dataKey];
        if (exportCol.type === 'date') {
          value = this.getDateFormatted(value);
        } else if (exportCol.type === 'numeric') {
          const currCode = obj['currencyTxt'];
          value = this.getCurrencyFormatted(value, currCode);
        } else if (exportCol.type === 'date-short') {
          value = this.getDateFormatted(value);
        }
        if (exportCol.translate) {
          value = this.getTranslation(`${value}`);
        }
        if (format === this.EXCEL_TYPE) {
          tuple[this.getTranslation(exportCol.title)] = value;
        } else {
          tuple[exportCol.dataKey] = value;
        }
      });
      records.push(tuple);
      tuple = [];
    });

    return records;
  }

  // Buttons and Actions
  protected handleActionButtons(): void {
    if (this.selectedObjs && this.selectedObjs.length === 1) {
      this.enableActionButtons();
      this.selectedObj = this.selectedObjs[0];
    } else {
      this.disableActionButtons();
      this.selectedObj = null;
    }
  }

  private disableActionButtons(): void {
    this.actionDisabled = true;
  }

  private enableActionButtons(): void {
    this.actionDisabled = false;
  }
  // Buttons and Actions

  // Row select events
  public onRowSelect(event: any): void {
    //this.handleActionButtons();
    this.logger.debug('onRowSelect, event:', event.data.id);

    if (event.data?.status === 'COMPLETADA' || event.data?.status === 'CANCELADA') {
      this.disableActionButtons();
    } else {
      this.enableActionButtons();
    }
    console.log(event.data);
    this.selectedObj = event.data.id;
  }

  public onRowUnselect(event: any): void {
    //this.handleActionButtons();
    this.logger.debug('onRowUnselect, event:', event.data.id);
    this.disableActionButtons();
    this.selectedObj = null;
  }

  public onHeaderCheckboxToggle(event: any): void {
    this.handleActionButtons();
  }

  public onDatePeriodFilter(event: any, dateField: any, dt: any): void {
    this.logger.debug(event);
    if (event === -1) {
      dt.filter(null, dateField, 'equals');
    } else {
      const dateValue = new Date(super.minusMonths(new Date(), event));
      const dateTime = dateValue.getTime();
      dt.filter(dateTime, dateField, 'gte');
    }
  }

  public onDateFilter(event: any, dateField: any, dt: any): void {
    const dateValue = new Date(event).getTime();
    this.logger.debug('onDateFilter gte : ', dateValue);
    dt.filter(dateValue, dateField, 'gte');
  }

  public onResetFilter(event, dt): void {
    this.logger.debug('onResetFilter');
    dt.reset();
  }

  public onFilterClick(dt): void {
    this.logger.debug('onFilterClick');

    if (this.showFilter) {
      dt.clear();
    }
    this.showFilter = !this.showFilter;
   
  }

  public clear(_table: Table) {
    this.logger.debug('clear table');
    _table.clear();
  }

  public openTablePreference(): void {
    this.logger.debug('openTablePreference for : ', this.tableName);
    const modal = this.dialogService.open(TablePreferenceDialogComponent, {
      context: {
        tableName: this.tableName,
        cols: this.cols,
        selectedCols: this.selectedCols,
        modalStyle: 'width: 120em; height: 31em;',
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        super.showToast('success', 'message.title.success', 'message.body.update-success');
      }
    });
  }

  public openTableExport(dt): void {
    this.logger.debug('openTableExport for : ', this.tableName);
    const modal = this.dialogService.open(TableExportDialogComponent, {
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        switch (res.format) {
          case 'pdf':
            this.exportPdf();
            break;
          case 'xls':
            this.exportExcel(dt);
            break;
          case 'csv':
            // this.exportCSV(res.separator);
            break;
          default:
            this.exportPdf();
            break;
        }
      }
    });
  }
}
