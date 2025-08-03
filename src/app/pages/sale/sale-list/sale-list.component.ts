import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { ISale } from '../../../@core/shared/model/sale.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { SaleService } from '../../../@core/shared/service/sale.service';
import { EnumService } from '../../../@core/shared/service/enum.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';

@Component({
  selector: 'ngx-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss'],
})
export class SaleListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public saleTypes: string[];
  public showAlert = true;
  public cId: string;

  @ViewChild('dt') table: Table;

  constructor(
    private saleService: SaleService,
    private communicationService: CommunicationService,
    private cd: ChangeDetectorRef,
  ) {
    super('sale');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.initTable();
    //this.refreshTable();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  // private refreshTable() {
  //   this.cd.detectChanges();
  //   this.table.reset();
  //   this.table.saveState();
  //   this.cd.detectChanges();
  // }

  private initAll(): void {
    this.logger.debug('initAll');

    this.initValues();
    this.initTable();
    //this.refreshTable();
  }

  private initValues(): void {
    // set multiselect records table
    this.multiSelectRecordDisabled = false;

    this.cId = localStorage.getItem('cId');

    super.setSelectedObj(null);
    super.initBaseValues();
    this.initSubscriptors();
    //this.initListBoxes();
  }

  private initSubscriptors(): void {
    const tablePreference$ = this.communicationService.tablePreferenceComponent.subscribe((res) => {
      if (res) {
        this.tablePreference = res;
        this.logger.debug('tablePreference$: ', this.tablePreference);
        this.destroySubscriptors();
        this.initAll();
      }
    });
    this.subscriptions.push(tablePreference$);
  }

  private initListBoxes(): void {
    // this.listSaleTypes();
  }

  // private listSaleTypes(): void {
  //   const saleTypes$ = this.enumService.listSaleType().subscribe((res: any) => {
  //     if (res) {
  //       this.saleTypes = res;
  //       this.logger.debug('sale types : ', this.saleTypes);
  //     }
  //   });
  //   this.subscriptions.push(saleTypes$);
  // }

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'code',
        header: 'Código',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'image',
        header: 'Logo',
        width: '5%',
        type: 'boolean',
        exportable: true,
        filtrable: true,
        translate: true,
      },
      {
        field: 'name',
        header: 'Nombre',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'price',
        header: 'Costo Mayorista',
        width: '10%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'pricePublic',
        header: 'Precio Venta Sugerido ',
        width: '17%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'profit',
        header: 'Ganancia',
        width: '17%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'duration',
        header: 'Duración',
        width: '17%',
        type: 'text',
        hide: false,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'isEnabled',
        header: 'Habilitado',
        width: '5%',
        type: 'boolean',
        exportable: true,
        filtrable: true,
        translate: true,
      },

      // {
      //   field: 'isActive',
      //   header: 'Activo',
      //   width: '5%',
      //   type: 'boolean',
      //   exportable: true,
      //   filtrable: true,
      //   translate: true,
      // },
    ];
    super.initTableProperties();
  }

  public find(): void {
    this.findAll();
  }

  private findAll(): void {
    this.logger.debug('find all');
    this.objs = [];
    this.showSpinner = true;
    const dataList$ = this.saleService.findAllByCompanyId(this.cId).subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs.forEach((item) => {
          if (item.Account[0]) {
            item.image = item.Account[0].Platform.image;
            item.platformName = item.Account[0].Platform.name;
          } else {
            item.image = 'item.Account[0].Platform.image;';
            item.platformName = 'item.Account[0].Platform.name;';
          }

          if (item.Company) {
            item.companyName = item.Company.name;
            item.companyId = item.Company.id;
          } else {
            item.companyName = '-';
            item.companyId = '-';
          }
        });
        this.totalRecords = res.data.length;
        this.logger.debug('sale: ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar salea',
        description: 'Se eliminará la salea ' + this.selectedObj.fiscalName,
        loadingMsg: '... eliminando la salea ' + this.selectedObj.fiscalName,
        action: this.saleService.delete(this.selectedObj.id),
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        super.handleCRUDResponse(res, 'D');
        this.find();
      }
    });
  }

  public onValueChange(event: boolean, id: string): void {
    this.logger.debug('onValueChange event');

    const saleEnable$ = this.saleService.findById(id).subscribe((res: any) => {
      if (res) {
        const sale: ISale = res.data[0];
        this.saleService.update(sale).subscribe((resUpd) => {
          if (resUpd) {
            const updObj = resUpd.data;
            super.showToast('success', 'message.title.success', 'message.body.update-success');
            //this.showToast('success', 'Éxito', 'Registro actualuzado correctamente');
            //super.setSelectedObj(updObj.id);
          }
        });
      }
    });
    //this.subscriptions.push(saleEnable$);
  }

  public onCloseAlert(): void {
    this.showAlert = false;
  }
}
