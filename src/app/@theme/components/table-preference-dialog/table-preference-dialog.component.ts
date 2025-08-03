import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { ITablePreference } from '../../../@core/shared/model/table-preference.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { TablePreferenceService } from '../../../@core/shared/service/table-preference.service';

@Component({
  selector: 'ngx-table-preference-dialog',
  templateUrl: './table-preference-dialog.component.html',
  styleUrls: ['table-preference-dialog.component.scss'],
})
export class TablePreferenceDialogComponent extends BaseFormComponent implements OnInit, OnDestroy {
  @Input() tableName: string;

  @Input() cols: any[];

  @Input() selectedCols: any[];
  selectedItem = '10';

  public _selectedColumns: any[];

  public obj: ITablePreference;

  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private tablePreferenceService: TablePreferenceService,
    private communicationService: CommunicationService,
  ) {
    super(activeDialog);
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.printInputVals();
    this.initValues();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  private printInputVals(): void {
    super.printInputValues();
    this.logger.debug('input tableName : ', this.tableName);
    this.logger.debug('input cols : ', this.cols);
    this.logger.debug('input selected cols : ', this.selectedCols);
  }

  private initValues(): void {
    this.obj = {} as ITablePreference;
    this._selectedColumns = this.selectedCols;
    this.findByTableName();
  }

  updateSelectedCols(event): void {
    // Filtrar las columnas activas y actualizar selectedCols
    this._selectedColumns = this.selectedCols.filter((col) => event.value.includes(col));
    this.logger.debug('updateSelectedCols, selectedCols', this._selectedColumns);
  }

  private findByTableName(): void {
    this.logger.debug('findTablePreferenceByModule');
    this.showSpinner = true;
    const tablePreference$ = this.tablePreferenceService.findByTableName(this.tableName).subscribe((res) => {
      if (res) {
        this.obj = res.data;
        this.logger.debug('table preference : ', this.obj);
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(tablePreference$);
  }

  // Función para ordenar los datos en _selectedColumns según el orden en cols
  orderSelectedColumnsByCols(): void {
    const orderedSelectedColumns = [];

    // Recorre cols para encontrar cada campo en _selectedColumns
    for (const col of this.cols) {
      const selectedCol = this._selectedColumns.find((selected) => selected.field === col.field);
      if (selectedCol) {
        orderedSelectedColumns.push(selectedCol);
      }
    }

    // Actualiza _selectedColumns con los datos ordenados
    this._selectedColumns = orderedSelectedColumns;
  }

  public onSubmit(): void {
    this.logger.debug('tablePreferenceUpdate onSubmit');
    const cols = JSON.stringify(this.cols);
    this.obj.cols = cols;

    // Llama a la función para ordenar los datos
    this.orderSelectedColumnsByCols();

    const selectedCols = JSON.stringify(this._selectedColumns);
    this.obj.selected_cols = selectedCols;

    const tablePreferenceUpdate$ = this.tablePreferenceService.update(this.obj).subscribe((res: any) => {
      if (res) {
        this.communicationService.updateTablePreferenceComponent(res.data);
        super.handleSuccessfulEditObj(res);
      }
    });
    this.subscriptions.push(tablePreferenceUpdate$);

    // window.location.reload();
  }
}
