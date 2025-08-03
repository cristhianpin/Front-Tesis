import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { getRoleLabel } from '../../../@core/shared/enum/role.enum';
import { IUserDetail } from '../../../@core/shared/model/user-detail.model';
import { ClientDetailService } from '../../../@core/shared/service/client-detail.service';
import {
  ApprovalDialogComponent
} from '../../pending-payment/pending-payment-status/approval/approval-dialog.component';
import { RestoreDialogComponent } from '../restore/restore-dialog.component';

@Component({
  selector: 'ngx-client-detail-list',
  templateUrl: './client-detail-list.component.html',
  styleUrls: ['./client-detail-list.component.scss'],
})
export class ClientDetailListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;

  @ViewChild('dt') table: Table;

  constructor(private clientDetailService: ClientDetailService, private communicationService: CommunicationService) {
    super('client-detail');
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

  protected initAll(): void {
    this.logger.debug('initAll');

    this.initValues();
    this.initTable();
  }

  private initValues(): void {
    this.multiSelectRecordDisabled = false;
    this.cId = localStorage.getItem('cId');
    super.setSelectedObj(null);
    super.initBaseValues();
    this.initSubscriptors();
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

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'identification',
        header: 'Cédula',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'client',
        header: 'Cliente',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'email',
        header: 'Correo electrónico',
        width: '25%',
        type: 'text',
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
      {
        field: 'created_at',
        header: 'Fecha Creación',
        width: '25%',
        type: 'date',
        exportable: false,
        filtrable: true,
        sortable: true,
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
    const dataList$ = this.clientDetailService.index().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs.forEach((item) => {
          if (item.user) {
            item.email = item?.user?.email;
            item.isEnabled = item?.user?.is_enabled;
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

  public restorePassword(): void {
    const modal = this.dialogService.open(RestoreDialogComponent, {
      context: {
        id: this.selectedObj,
        title: 'Restaurar contraseña',
        description: 'La contraseña por defecto será la cédula del cliente',
        loadingMsg: '... restaurando',
        action: this.clientDetailService.restore(this.selectedObj),
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        super.handleCRUDResponse(res, 'U');
        this.find();
      }
    });
  }

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj,
        title: 'Eliminar registro',
        description: 'Se eliminará el registro',
        loadingMsg: '... eliminando el registro',
        action: this.clientDetailService.delete(this.selectedObj),
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

    const suscription$ = this.clientDetailService.find(id).subscribe((res: any) => {
      if (res) {
        const userDetail = new IUserDetail(res.data);
        userDetail.isEnabled = event;
        this.clientDetailService.update(userDetail).subscribe((res) => {
          if (res) {
            super.showToast('success', 'message.title.success', 'message.body.update-success');
          }
        });
      }
    });
    this.subscriptions.push(suscription$);
  }

  public onCloseAlert(): void {
    this.showAlert = false;
  }
}
