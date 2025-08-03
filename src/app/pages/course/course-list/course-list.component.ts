import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { IUserDetail } from '../../../@core/shared/model/user-detail.model';
import { CourseService } from '../../../@core/shared/service/course.service';
import { ICourse } from '../../../@core/shared/model/course.model';
import { getRoleLabel } from '../../../@core/shared/enum/role.enum';

@Component({
  selector: 'ngx-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;

  @ViewChild('dt') table: Table;

  constructor(private courseService: CourseService, private communicationService: CommunicationService) {
    super('course');
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
        field: 'name',
        header: 'Curso',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'description',
        header: 'Descripción',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'total_seats',
        header: 'Cupos totales',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'available_seats',
        header: 'Cupos disponibles',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'start_date',
        header: 'Fecha de inicio',
        width: '25%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'end_date',
        header: 'Fecha de fin',
        width: '25%',
        type: 'date',
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
    const dataList$ = this.courseService.index().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs.forEach((item) => {
          item.isEnabled = item?.is_enabled;
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
        action: this.courseService.delete(this.selectedObj),
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

    const suscription$ = this.courseService.find(id).subscribe((res: any) => {
      if (res) {
        const item = new ICourse(res.data);
        item.isEnabled = event;
        this.courseService.update(item).subscribe((res) => {
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
