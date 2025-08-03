import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';

import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { BookingService } from '../../../@core/shared/service/booking.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { ITrnStatus } from '../../../@core/shared/model/trn-status.model';
import { BookingCountEnum } from '../../../@core/shared/enum/booking-count.enum';

@Component({
  selector: 'ngx-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public uuid: string;
  public cId: string;

  public statuses: ITrnStatus[] = [];

  constructor(private bookingService: BookingService, private communicationService: CommunicationService) {
    super('booking');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.initTable();
  }

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
    this.cId = localStorage.getItem('cId');

    // set multiselect records table
    this.multiSelectRecordDisabled = false;

    //this.selectedObj = this.selectedObj === undefined ? this.companyId : this.selectedObj;

    super.setSelectedObj(null);
    this.initObjs();
    super.initBaseValues();
    this.initSubscriptors();
    //this.initListBoxes();
  }

  private initObjs(): void {}

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
    // this.listBookingTypes();
  }

  // private listBookingTypes(): void {
  //   const platformTypes$ = this.enumService.listBookingType().subscribe((res: any) => {
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
        exportable: true,
        filtrable: true,
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
        field: 'count',
        header: 'Cantidad',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'fromAt',
        header: 'F. Desde',
        width: '25%',
        type: 'date-short',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'untilAt',
        header: 'F. Hasta',
        width: '10%',
        type: 'date-short',
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
      // {
      //   field: 'status',
      //   header: 'Estado',
      //   width: '10%',
      //   type: 'text',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
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
        field: 'createdAt',
        header: 'Creación',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
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
    const dataList$ = this.bookingService.findAllByCompanyId(this.cId).subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.objs.forEach((item) => {
          item.image = item.Platform.image;
          item.platformName = item.Platform.name;

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

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar cuenta',
        description: 'Se eliminará la cuenta ' + this.selectedObj.fiscalName,
        loadingMsg: '... eliminando la cuenta ' + this.selectedObj.fiscalName,
        action: this.bookingService.delete(this.selectedObj.id),
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

    const modal = this.dialogService.open(BookingFormComponent, {
      context: {
        operation: operation,
        objIdModal: selectedObj,
        modalStyle: 'width: 30em; height: 35em;',
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
}
