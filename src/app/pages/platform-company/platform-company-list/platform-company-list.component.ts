import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';

import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { PlatformCompanyService } from '../../../@core/shared/service/platform-company.service';
import { PlatformCompanyFormComponent } from '../platform-company-form/platform-company-form.component';

@Component({
  selector: 'ngx-platform-company-list',
  templateUrl: './platform-company-list.component.html',
  styleUrls: ['./platform-company-list.component.scss'],
})
export class PlatformCompanyListComponent extends BaseListComponent implements OnInit, OnDestroy {
  @Input() companyId?: string;
  public uuid: string;

  constructor(private platformCompanyService: PlatformCompanyService, private communicationService: CommunicationService) {
    super('platform-company');
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
    // set multiselect records table
    this.multiSelectRecordDisabled = false;

    //this.selectedObj = this.selectedObj === undefined ? this.companyId : this.selectedObj;

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

    // const updateRecord$ = this.communicationService.platformCompanyComponent.subscribe((res) => {
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
    // this.listPlatformCompanyTypes();
  }

  // private listPlatformCompanyTypes(): void {
  //   const platformTypes$ = this.enumService.listPlatformCompanyType().subscribe((res: any) => {
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
        field: 'platformCode',
        header: 'Código',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'platformImage',
        header: 'Logo',
        width: '5%',
        type: 'boolean',
        exportable: true,
        filtrable: true,
        translate: true,
      },
      {
        field: 'platformName',
        header: 'Nombre',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'count',
        header: 'Disponible',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'cost',
        header: 'Costo Mayorista',
        width: '10%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'pricePublic',
        header: 'Precio Venta Sugerido',
        width: '17%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'platformProfit',
        header: 'Ganancia Mayorista',
        width: '17%',
        type: 'numeric',
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
    ];

    if (!this.isRoot) {
      this.cols = this.cols.filter((col) => col.field !== 'count');
    }

    // if (!this.isRoot) {
    //   this.cols = this.cols.filter((col) => col.field !== 'isEnabled');
    // }

    super.initTableProperties();
  }

  public find(): void {
    this.findAll();
  }

  private findAll(): void {
    this.logger.debug('find all');
    this.objs = [];

    this.showSpinner = true;
    // const dataList$ = this.platformCompanyService.findAllByCompanyId(this.companyId, 'no-enabled').subscribe((res: any) => {
    //   if (res) {
    //     this.objs = res.data;
    //
    //     this.objs.forEach((item) => {
    //       item.platformId = item.Platform.id;
    //       item.platformCode = item.Platform.code;
    //       item.platformName = item.Platform.name;
    //       item.platformPrice = item.Platform.price;
    //       item.platformPricePublic = item.Platform.pricePublic;
    //       // item.platformProfit = Number(item.pricePublic) - Number(item.Platform.price);
    //       item.platformProfit = Number(item.pricePublic) - Number(item.cost);
    //       item.platformImage = item.Platform.image;
    //       item.companyId = item.Company.id;
    //       item.companyName = item.Company.name;
    //       item.cost = item.cost;
    //       item.pricePublic = item.pricePublic;
    //       item.isEnabled = item.isEnabled;
    //       item.createdAt = item.createdAt;
    //       item.createdBy = item.createdBy;
    //       item.updatedAt = item.updatedAt;
    //       item.updatedBy = item.updatedBy;
    //       item.count = item.count;
    //     });
    //
    //     this.totalRecords = res.data.length;
    //     this.logger.debug('platform-company: ', this.objs);
    //     this.logger.debug('total of records : ', this.totalRecords);
    //     this.handleActionButtons();
    //     this.showSpinner = false;
    //   }
    // });
    // this.subscriptions.push(dataList$);
  }

  // public delete(): void {
  //   const modal = this.dialogService.open(DeleteDialogComponent, {
  //     context: {
  //       id: this.selectedObj.id,
  //       title: 'Eliminar compañia',
  //       description: 'Se eliminará la compañia ' + this.selectedObj.fiscalName,
  //       loadingMsg: '... eliminando la compañia ' + this.selectedObj.fiscalName,
  //       action: this.platformCompanyService.delete(this.selectedObj.id),
  //     },
  //     autoFocus: false,
  //     hasScroll: true,
  //     hasBackdrop: true,
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  //   modal.onClose.subscribe((res) => {
  //     if (res) {
  //       super.handleCRUDResponse(res, 'D');
  //       this.find();
  //     }
  //   });
  // }

  public onValueChange(event: boolean, id: string): void {
    this.logger.debug('onValueChange event');

    // const platformCompanyEnabled$ = this.platformCompanyService.findById(id).subscribe((res: any) => {
    //   if (res) {
    //     const platform: IPlatformCompany = res.data[0];
    //     platform.isEnabled = event;
    //     this.platformCompanyService.update(platform).subscribe((resUpd) => {
    //       if (resUpd) {
    //         const updObj = resUpd.data;
    //         super.showToast('success', 'message.title.success', 'message.body.update-success');
    //         //this.showToast('success', 'Éxito', 'Registro actualuzado correctamente');
    //         //super.setSelectedObj(updObj.id);
    //       }
    //     });
    //   }
    // });
    //this.subscriptions.push(platformCompanyEnabled$);
  }

  public onOpenForm(selectedObj: any, operation: string): void {
    this.logger.debug('onOpenForm');
    this.logger.debug('onOpenForm, selectedObj:', selectedObj);

    const modal = this.dialogService.open(PlatformCompanyFormComponent, {
      context: {
        operation: operation,
        objIdModal: selectedObj,
        modalStyle: 'width: 45em; height: 30em;',
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

        if (operation == 'C') {
          super.showToast('success', 'message.title.success', 'message.body.create-success');
        }
        if (operation == 'U') {
          super.showToast('success', 'message.title.success', 'message.body.update-success');
        }
        if (operation == 'D') {
          super.showToast('success', 'message.title.success', 'message.body.delete-success');
        }

        // super.showCRUDToast(res, operation, 'beneficiario', 'success');
        // this.selectedCompany = res;
        // this.showBeneficiaryInfo = true;
        // this.objForm.get('beneficiaryTxt').setValue(this.selectedCompany.nickname);
        // this.objForm.get('beneficiary').setValue(this.selectedCompany);
      }
      //  else {
      //   this.showBeneficiaryInfo = false;
      // }
    });
  }
}
