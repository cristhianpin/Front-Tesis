import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';

import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { AccountService } from '../../../@core/shared/service/account.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { AccountFormComponent } from '../account-form/account-form.component';
import { StatusAccountEnum } from '../../../@core/shared/enum/status-account.enum';
import { ITrnStatus } from '../../../@core/shared/model/trn-status.model';
import { AccountImportModalComponent } from '../account-import-modal/account-import-modal.component';
import { Table } from 'primeng/table';
import { ITrnOrigen } from '../../../@core/shared/model/trn-origin.model';
import { OrigenAccountEnum } from '../../../@core/shared/enum/origen-account.enum';
import { ITrnDeliveryType } from '../../../@core/shared/model/trn-delivery-type.model';
import { DeliveryTypeEnum } from '../../../@core/shared/enum/delivery-type.enum';

@Component({
  selector: 'ngx-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent extends BaseListComponent implements OnInit, OnDestroy {
  @ViewChild('dt', { static: false }) public _table: Table;

  @Input() companyId?: string;
  public showAlert = true;
  public uuid: string;

  public statuses: ITrnStatus[] = [];
  public origins: ITrnOrigen[] = [];
  public canals: ITrnDeliveryType[] = [];

  constructor(private accountService: AccountService, private communicationService: CommunicationService) {
    super('account');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.initTable();

    // ;
  }

  // ngAfterViewInit() {
  //   this.logger.debug('ngAfterViewInit');
  //   this._dt = this._table;
  // }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private initAll(): void {
    this.logger.debug('initAll');

    this.initValues();
    this.initTable();
  }

  private initValues(): void {
    // set multiselect records table
    this.multiSelectRecordDisabled = false;

    //this.selectedObj = this.selectedObj === undefined ? this.companyId : this.selectedObj;

    super.setSelectedObj(null);
    this.initObjs();
    super.initBaseValues();
    this.initSubscriptors();
    //this.initListBoxes();
  }

  private initObjs(): void {
    if (this.statuses.length == 0) {
      Object.values(StatusAccountEnum).forEach((sts) => {
        this.statuses.push({
          name: sts,
          code: sts,
          label: this.getTranslation(sts),
        });
      });

      if (!this.isRoot) {
        this.statuses = this.statuses.filter((col) => col.code !== StatusAccountEnum.REPLACEMENT);
      }
    }

    if (this.origins.length == 0) {
      Object.values(OrigenAccountEnum).forEach((sts) => {
        this.origins.push({
          name: sts,
          code: sts === 'Reserva' ? true : false,
          label: sts,
        });
      });
    }

    if (this.canals.length == 0) {
      Object.values(DeliveryTypeEnum).forEach((sts) => {
        this.canals.push({
          name: sts,
          code: sts,
          label: sts,
        });
      });
    }
  }

  private initSubscriptors(): void {
    const tablePreference$ = this.communicationService.tablePreferenceComponent.subscribe((res) => {
      if (res) {
        this.tablePreference = res;
        this.logger.debug('tablePreference$: ', this.tablePreference);
        this.destroySubscriptors();
        this.initAll();
        this.clear(this._table);
      }
    });
    this.subscriptions.push(tablePreference$);

    // const updateRecord$ = this.communicationService.accountComponent.subscribe((res) => {
    //   if (res) {
    //     // this.tablePreference = res;
    //     // this.logger.debug('tablePreference$: ', this.tablePreference);
    //     this.destroySubscriptors();
    //     this.initAll();
    //   }
    // });
    // this.subscriptions.push(updateRecord$);
  }

  private initListBoxes(): void {
    // this.listAccountTypes();
  }

  // private listAccountTypes(): void {
  //   const platformTypes$ = this.enumService.listAccountType().subscribe((res: any) => {
  //     if (res) {
  //       this.platformTypes = res;
  //       this.logger.debug('platform types : ', this.platformTypes);
  //     }
  //   });
  //   this.subscriptions.push(platformTypes$);
  // }

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'code',
        header: 'Código',
        width: '5%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'image',
        header: 'Plataforma',
        width: '25%',
        type: 'text',
        exportable: false,
        filtrable: false,
        translate: false,
      },
      {
        field: 'platformName',
        header: 'Nombre Plataforma',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'account',
        header: 'Usuario',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'password',
        header: 'Clave',
        width: '10%',
        type: 'text',
        hide: true,
        exportable: true,
        filtrable: true,
        translate: true,
      },
      // {
      //   field: 'screen',
      //   header: 'Pantalla',
      //   width: '10%',
      //   type: 'text',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      // {
      //   field: 'phone',
      //   header: 'Teléfono',
      //   width: '10%',
      //   type: 'text',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      {
        field: 'status',
        header: 'Estado',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'vigence',
        header: 'Vigencia días',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      // {
      //   field: 'reference',
      //   header: 'Referencia',
      //   width: '10%',
      //   type: 'text',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      {
        field: 'companyName',
        header: 'Mayorista',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'buyAt',
        header: 'F. Compra',
        width: '10%',
        type: 'date-short',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'isBooking',
        header: 'Origen',
        width: '10%',
        type: 'text',
        exportable: false,
        filtrable: false,
        translate: false,
      },
      {
        field: 'deliveryType',
        header: 'Canal',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: false,
        translate: false,
      },
      {
        field: 'bookingCode',
        header: 'Código Reserva',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: false,
        translate: false,
      },
      {
        field: 'cost',
        header: 'Costo Natvi',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: false,
        translate: false,
      },
      {
        field: 'exchange',
        header: 'Intercambio Natvi',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: false,
        translate: false,
      },
      {
        field: 'replacementAt',
        header: 'F. Reposición',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'validityUntilReplacement',
        header: 'Vigencia Reposición días',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'createdAt',
        header: 'Creación',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
    ];

    if (!this.isRoot) {
      this.cols = this.cols.filter((col) => col.field !== 'buyAt');
      this.cols = this.cols.filter((col) => col.field !== 'cost');
      this.cols = this.cols.filter((col) => col.field !== 'exchange');
      this.cols = this.cols.filter((col) => col.field !== 'companyName');
      this.cols = this.cols.filter((col) => col.field !== 'validityUntilReplacement');
      this.cols = this.cols.filter((col) => col.field !== 'replacementAt');
    }

    super.initTableProperties();
  }

  public find(): void {
    this.findAll();
  }

  private findAll(): void {
    this.logger.debug('find all');
    this.objs = [];

    this.showSpinner = true;
    const dataList$ = this.accountService.findAllAdm().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.objs.forEach((item) => {
          item.image = item.Platform.image;
          item.platformName = item.Platform.name;
          item.isBooking = item.isBooking;
          if (item.loadedAt) {
            const tmp = this.calculateVigency(item.loadedAt, Number(item.Platform.duration));
            item.vigence = tmp.remainingDays;
          } else {
            item.vigence = '---';
          }

          if (item.isBooking) {
            item.bookingCode = item.Booking.code;
          } else {
            item.bookingCode = '---';
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
        this.logger.debug('account: ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  calculateVigency(saleAt: Date, durationInDays: number): { isExpired: boolean; remainingDays: number } {
    const currentDate = new Date();
    const expirationDate = new Date(saleAt);
    expirationDate.setDate(expirationDate.getDate() + durationInDays);

    const remainingMilliseconds = expirationDate.getTime() - currentDate.getTime();
    let remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));

    if (remainingDays <= 0) {
      remainingDays = 0;
    }

    const isExpired = remainingDays <= 0;

    return { isExpired, remainingDays };
  }

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar cuenta',
        description: 'Se eliminará la cuenta ' + this.selectedObj.fiscalName,
        loadingMsg: '... eliminando la cuenta ' + this.selectedObj.fiscalName,
        action: this.accountService.delete(this.selectedObj.id),
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

  public onOpenForm(selectedObj: any, operation: string): void {
    this.logger.debug('onOpenForm');
    this.logger.debug('onOpenForm, selectedObj:', selectedObj);

    const modal = this.dialogService.open(AccountFormComponent, {
      context: {
        operation: operation,
        objIdModal: selectedObj,
        modalStyle: 'width: 30em; height: 33em;',
        modalSeverity: 'primary',
        isModal: true,
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      this.logger.debug('close modal in open method: ', res);
      if (res) {
        this.initAll();
        super.showToast('success', 'message.title.success', 'message.body.update-success');
      }
    });
  }

  public onCloseAlert(): void {
    this.logger.debug('onCloseAlert');
    this.showAlert = false;
  }

  public onOpenAccountImport(event): void {
    this.logger.debug(`onOpenAccountImport : ${event}`);

    const modal = this.dialogService.open(AccountImportModalComponent, {
      context: {
        modalStyle: 'width: 30em; height: 20em;',
        modalSeverity: 'primary',
        // // code: this.objModal.id,
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      this.logger.debug('close modal onOpenAccountImport: ', res);
      if (res) {
        this.initAll();
        this.clear(this._table);
        super.showToast('success', 'message.title.success', 'message.body.update-success');
      }
    });
  }
}
