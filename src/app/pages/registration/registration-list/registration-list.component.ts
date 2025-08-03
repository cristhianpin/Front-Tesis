import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { CourseService } from '../../../@core/shared/service/course.service';
import { ICourse } from '../../../@core/shared/model/course.model';

@Component({
  selector: 'ngx-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss'],
})
export class RegistrationListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;

  @ViewChild('dt') table: Table;

  constructor(private courseService: CourseService, private communicationService: CommunicationService) {
    super('registration');
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
    this.findAll();
    this.cols = [
      {
        field: 'order_id',
        header: 'Referencia',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'name',
        header: 'Curso',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
      },
      {
        field: 'description',
        header: 'Descripción',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
      },
      {
        field: 'receipt_path_base64',
        header: 'Comprobante',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'identification_path',
        header: 'Cédula',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'photo_path',
        header: 'Foto',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'modality',
        header: 'Modalidad',
        width: '15%',
        type: 'text',
        exportable: true,
        filtrable: true,
      },
      {
        field: 'status',
        header: 'Estado',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
      },
      {
        field: 'start_date',
        header: 'Inicio',
        width: '15%',
        type: 'date',
        exportable: true,
        filtrable: true,
      },
      {
        field: 'end_date',
        header: 'Fin',
        width: '15%',
        type: 'date',
        exportable: true,
        filtrable: true,
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

    const dataList$ = this.courseService.getMyCourses().subscribe((res: any) => {
      if (res?.data) {
        console.log('res?.data', res?.data);
        this.objs = res.data.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          course_id: item.course?.id,
          name: item.course?.name,
          description: item.course?.description,
          modality: item.course?.modality,
          tags: item.course?.tags,
          status: item.status,
          enrolled_at: item.enrolled_at,
          start_date: item.course?.start_date,
          end_date: item.course?.end_date,
          identification_path: item.user_detail?.identification_base64,
          receipt_path_base64: item.receipt_path,
          photo_path: item.user_detail?.photo_base64,
        }));

        this.totalRecords = this.objs.length;
        this.logger.debug('mapped objs:', this.objs);
        this.handleActionButtons();
      }
      this.showSpinner = false;
    });

    this.subscriptions.push(dataList$);
  }

  public delete(): void {
    console.log(this.selectedObj);
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj,
        title: 'Cancelar la matrícula',
        description: 'Se cancelará la matricula',
        loadingMsg: '... cancelando la matrícula',
        action: this.courseService.cancelEnrollment(this.selectedObj),
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        super.handleCRUDResponse('Cancelada Correctamente', 'D');
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
