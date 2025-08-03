import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { EnumService } from '../../../@core/shared/service/enum.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { PlatformCompanyService } from '../../../@core/shared/service/platform-company.service';
import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';
import { PlatformCompanyFormComponent } from '../../platform-company/platform-company-form/platform-company-form.component';
import { PlatformClientFormSaleComponent } from '../platform-client-form-sale/platform-client-form-sale.component';
import { AccountFormComponent } from '../../account/account-form/account-form.component';
import { PlatformClientFormViewComponent } from '../platform-client-form-view/platform-client-form-view.component';
import { DeliveryTypeEnum } from '../../../@core/shared/enum/delivery-type.enum';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'ngx-platform-client-list',
  templateUrl: './platform-client-list.component.html',
  styleUrls: ['./platform-client-list.component.scss'],
})
export class PlatformClientListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public platformTypes: string[];
  public showAlert = true;

  public layout: string = 'list';

  public platformCompanies: IPlatformCompany[];

  public isSmallScreen: boolean;

  @ViewChild('dt') table: Table;

  constructor(
    private platformCompanyService: PlatformCompanyService,
    private communicationService: CommunicationService,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {
    super('platform-client');
    this.breakpointObserver.observe([Breakpoints.Small]).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
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

    this.breakpointObserver.observe([Breakpoints.Small]).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
    this.logger.debug('this.isSmallScreen: ', this.isSmallScreen);

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
        hide: true,
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
        hide: true,
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

    const companyId = localStorage.getItem('cId');
    this.logger.debug('localStorage, companyId: ', companyId);

    // const dataList$ = this.platformCompanyService.findAllByCompanyId(companyId, 'enabled').subscribe((res: any) => {
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
    //     });
    //
    //     this.totalRecords = res.data.length;
    //     this.logger.debug('platform : ', this.objs);
    //     this.logger.debug('total of records : ', this.totalRecords);
    //     this.handleActionButtons();
    //     this.showSpinner = false;
    //   }
    // });
    // this.subscriptions.push(dataList$);
  }

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar platforma',
        description: 'Se eliminará la platforma ' + this.selectedObj.fiscalName,
        loadingMsg: '... eliminando la platforma ' + this.selectedObj.fiscalName,
        action: this.platformCompanyService.delete(this.selectedObj.id),
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

    // const platformEnable$ = this.platformCompanyService.findById(id).subscribe((res: any) => {
    //   if (res) {
    //     const platform: IPlatformCompany = res.data[0];
    //     platform.isEnabled = event;
    //     this.platformCompanyService.update(platform).subscribe((resUpd) => {
    //       if (resUpd) {
    //         const updObj = resUpd.data;
    //         //this.showToast('success', 'Éxito', 'Registro actualuzado correctamente');
    //         //super.setSelectedObj(updObj.id);
    //       }
    //     });
    //   }
    // });
    //this.subscriptions.push(platformEnable$);
  }

  public onCloseAlert(): void {
    this.showAlert = false;
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

        super.showToast('success', 'message.title.success', 'message.body.update-success');

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

  public onOpenFormSale(selectedObj: any, operation: string): void {
    this.logger.debug('onOpenFormSale');
    this.logger.debug('onOpenFormSale, selectedObj:', selectedObj);

    const modal = this.dialogService.open(PlatformClientFormSaleComponent, {
      context: {
        operation: operation,
        objIdModal: selectedObj,
        modalStyle: 'width: 45em; height: 35em;',
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
        // this.initAll();
        super.showToast('success', 'message.title.success', 'message.body.sale-success');
        this.logger.debug('res modal: ', res);
        this.logger.debug('accountId: ', res.data[0].account.id);
        this.logger.debug('deliveryType: ', res.data[0].account.deliveryType);

        // if (res.data[0].account.deliveryType === DeliveryTypeEnum.WEB) {
        if (res.data[0].account.id) {
          const modal = this.dialogService.open(PlatformClientFormViewComponent, {
            context: {
              operation: 'R',
              objIdModal: res.data[0].account.id,
              modalStyle: 'width: 45em; height: 45em;',
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
              // this.initAll();
              // super.showToast('success', 'message.title.success', 'message.body.sale-success');
            }
          });
        }
      }
    });
  }
}
