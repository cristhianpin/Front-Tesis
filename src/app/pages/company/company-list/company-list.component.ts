import { Component, OnDestroy, OnInit } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { ICompany } from '../../../@core/shared/model/company.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { CompanyService } from '../../../@core/shared/service/company.service';
import { EnumService } from '../../../@core/shared/service/enum.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { UserRegisterFormComponent } from '../user-register-form/user-register-form.component';

@Component({
  selector: 'ngx-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public companyTypes: string[];
  public showAlert = true;

  constructor(
    private companyService: CompanyService,
    private enumService: EnumService,
    private communicationService: CommunicationService,
  ) {
    super('company');
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

    super.setSelectedObj(null);
    super.initBaseValues();
    this.initSubscriptors();
    this.initListBoxes();
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
    // this.listCompanyTypes();
  }

  // private listCompanyTypes(): void {
  //   const companyTypes$ = this.enumService.listCompanyType().subscribe((res: any) => {
  //     if (res) {
  //       this.companyTypes = res;
  //       this.logger.debug('company types : ', this.companyTypes);
  //     }
  //   });
  //   this.subscriptions.push(companyTypes$);
  // }

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'code',
        header: 'Código',
        width: '25%',
        hide: true,
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
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
        field: 'balance',
        header: 'Balance',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'accountLast7Days',
        header: 'Asignada 7 Días',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'accountAll',
        header: 'Asignada Total',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'profit',
        header: 'Ganancia',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'description',
        header: 'Referencia',
        width: '10%',
        type: 'text',
        hide: true,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'phone',
        header: 'Teléfono',
        width: '10%',
        type: 'text',
        hide: true,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'nick',
        header: 'Nickname',
        width: '17%',
        type: 'text',
        hide: false,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'planSlug',
        header: 'Plan precio',
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
    ];

    if (!this.isRoot) {
      this.cols = this.cols.filter((col) => col.field !== 'isEnabled');
      this.cols = this.cols.filter((col) => col.field !== 'planSlug');
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
    const companies$ = this.companyService.findAllAdm().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.totalRecords = this.objs.length;
        this.logger.debug('company : ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(companies$);
  }

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar compañia',
        description: 'Se eliminará la compañia ' + this.selectedObj.fiscalName,
        loadingMsg: '... eliminando la compañia ' + this.selectedObj.fiscalName,
        action: this.companyService.delete(this.selectedObj.id),
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

    const companyEnable$ = this.companyService.findById(id).subscribe((res: any) => {
      if (res) {
        const company: ICompany = res.data[0];
        company.isEnabled = event;
        this.companyService.update(company).subscribe((resUpd) => {
          if (resUpd) {
            const updObj = resUpd.data;
            // this.showToast('success', resUpd.message.title, resUpd.message.body);
            //super.setSelectedObj(updObj);
            super.showToast('success', 'message.title.success', 'message.body.update-success');
          }
        });
      }
    });
    //this.subscriptions.push(companyEnable$);
  }

  public onCloseAlert(): void {
    this.logger.debug('onCloseAlert');
    this.showAlert = false;
  }

  public onOpenFormNew(operation: string): void {
    this.logger.debug('onOpenForm');

    const modal = this.dialogService.open(UserRegisterFormComponent, {
      context: {
        operation: operation,
        objIdModal: null,
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
      }
    });
  }
}
