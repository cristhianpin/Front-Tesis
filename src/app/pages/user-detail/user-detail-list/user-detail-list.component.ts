import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { UserDetailService } from '../../../@core/shared/service/user-detail.service';
import { getRoleLabel } from '../../../@core/shared/enum/role.enum';
import { IUserDetail } from '../../../@core/shared/model/user-detail.model';

@Component({
  selector: 'ngx-user-detail-list',
  templateUrl: './user-detail-list.component.html',
  styleUrls: ['./user-detail-list.component.scss'],
})
export class UserDetailListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;

  @ViewChild('dt') table: Table;

  constructor(private userDetailService: UserDetailService, private communicationService: CommunicationService) {
    super('user-detail');
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
        field: 'first_name',
        header: 'Nombres',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'last_name',
        header: 'Apellidos',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'role',
        header: 'Rol',
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
      // {
      //   field: 'image',
      //   header: 'Logo',
      //   width: '5%',
      //   type: 'boolean',
      //   exportable: true,
      //   filtrable: true,
      //   translate: true,
      // },
      // {
      //   field: 'name',
      //   header: 'Nombre',
      //   width: '10%',
      //   type: 'text',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      // {
      //   field: 'price',
      //   header: 'Costo Mayorista',
      //   width: '10%',
      //   type: 'numeric',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      // {
      //   field: 'pricePublic',
      //   header: 'Precio Venta Sugerido ',
      //   width: '17%',
      //   type: 'numeric',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      // {
      //   field: 'profit',
      //   header: 'Ganancia',
      //   width: '17%',
      //   type: 'numeric',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      // {
      //   field: 'duration',
      //   header: 'Duración',
      //   width: '17%',
      //   type: 'text',
      //   hide: false,
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
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
    const dataList$ = this.userDetailService.index().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs.forEach((item) => {
          if (item.user) {
            item.role = getRoleLabel(item?.user?.role);
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

  public delete(): void {
    console.log(this.selectedObj);
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj,
        title: 'Eliminar registro',
        description: 'Se eliminará el registro',
        loadingMsg: '... eliminando el registro',
        action: this.userDetailService.delete(this.selectedObj),
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

    const suscription$ = this.userDetailService.find(id).subscribe((res: any) => {
      if (res) {
        const userDetail = new IUserDetail(res.data);
        userDetail.isEnabled = event;
        this.userDetailService.update(userDetail).subscribe((res) => {
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
