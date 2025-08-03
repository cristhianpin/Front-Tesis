import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';

import { IPlatformPlan } from '../../../@core/shared/model/platform-plan.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { PlatformPlanService } from '../../../@core/shared/service/platform-plan.service';
import { PlatformPlanFormComponent } from '../platform-plan-form/platform-plan-form.component';

@Component({
  selector: 'ngx-platform-plan-list',
  templateUrl: './platform-plan-list.component.html',
  styleUrls: ['./platform-plan-list.component.scss'],
})
export class PlatformPlanListComponent extends BaseListComponent implements OnInit, OnDestroy {
  @Input() platformId?: string;
  public uuid: string;

  constructor(private platformPlanService: PlatformPlanService, private communicationService: CommunicationService) {
    super('platform-plan');
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
    // this.listPlatformPlanTypes();
  }

  // private listPlatformPlanTypes(): void {
  //   const platformTypes$ = this.enumService.listPlatformPlanType().subscribe((res: any) => {
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
        field: 'planCode',
        header: 'Código',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'planName',
        header: 'Plan',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      // {
      //   field: 'planSlug',
      //   header: 'Slug',
      //   width: '10%',
      //   type: 'text',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      // {
      //   field: 'platformImage',
      //   header: 'Logo',
      //   width: '5%',
      //   type: 'boolean',
      //   hide: false,
      //   exportable: true,
      //   filtrable: true,
      //   translate: true,
      // },
      // {
      //   field: 'platformName',
      //   header: 'Nombre Plataform',
      //   width: '10%',
      //   type: 'text',
      //   hide: false,
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      {
        field: 'platformPrice',
        header: 'Costo Mayorista',
        width: '10%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'platformCost',
        header: 'Costo Natvi',
        width: '17%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'platformProfit',
        header: 'Ganancia Natvi',
        width: '17%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'createdAt',
        header: 'F. Creación',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'updatedAt',
        header: 'F. Actualización',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
    ];

    if (!this.isRoot) {
      // this.cols = this.cols.filter((col) => col.field !== 'count');
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
    const dataList$ = this.platformPlanService.findAllByPlatformId(this.platformId).subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.totalRecords = res.data.length;
        this.logger.debug('platform-plan: ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  // public delete(): void {
  //   const modal = this.dialogService.open(DeleteDialogComponent, {
  //     context: {
  //       id: this.selectedObj.id,
  //       title: 'Eliminar compañia',
  //       description: 'Se eliminará la compañia ' + this.selectedObj.fiscalName,
  //       loadingMsg: '... eliminando la compañia ' + this.selectedObj.fiscalName,
  //       action: this.platformPlanService.delete(this.selectedObj.id),
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

  // public onValueChange(event: boolean, id: string): void {
  //   this.logger.debug('onValueChange event');

  //   const platformCompanyEnabled$ = this.platformPlanService.findById(id).subscribe((res: any) => {
  //     if (res) {
  //       const platform: IPlatformPlan = res.data[0];
  //       platform.isEnabled = event;
  //       this.platformPlanService.update(platform).subscribe((resUpd) => {
  //         if (resUpd) {
  //           const updObj = resUpd.data;
  //           super.showToast('success', 'message.title.success', 'message.body.update-success');
  //           //this.showToast('success', 'Éxito', 'Registro actualuzado correctamente');
  //           //super.setSelectedObj(updObj.id);
  //         }
  //       });
  //     }
  //   });
  //   //this.subscriptions.push(platformCompanyEnabled$);
  // }

  public onOpenForm(selectedObj: any, operation: string): void {
    this.logger.debug('onOpenForm');
    this.logger.debug('onOpenForm, selectedObj:', selectedObj);

    const modal = this.dialogService.open(PlatformPlanFormComponent, {
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
