import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { ContractService } from '../../../@core/shared/service/contract.service';

@Component({
  selector: 'ngx-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
})
export class ContractListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;

  enrollmentStatuses = [
    { label: 'ACTIVA', value: 'ACTI' },
    { label: 'CANCELADA', value: 'CANC' },
    { label: 'COMPLETADA', value: 'COMP' },
    { label: 'PENDIENTE', value: 'PEND' },
    { label: 'EXPIRADA', value: 'EXPI' },
    { label: 'RECHAZADA', value: 'REJE' },
  ];

  @ViewChild('dt') table: Table;

  constructor(private contractService: ContractService, private communicationService: CommunicationService) {
    super('contract');
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
        field: 'order_id',
        header: 'Referencia',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'course',
        header: 'Curso',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'user_detail',
        header: 'Estudiante',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
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
        field: 'receipt_path',
        header: 'Comprobante',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'pre_contract_path',
        header: 'Contrato',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'start_course',
        header: 'Inicio de curso',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'end_course',
        header: 'Fin de curso',
        width: '10%',
        type: 'date',
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
    const dataList$ = this.contractService.index().subscribe((res: any) => {
      if (res) {
        console.log('res.data', res.data);
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs = res.data.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          course_id: item.course?.id,
          user_detail: item.user_detail?.first_name + ' ' + item.user_detail?.last_name,
          course: item.course?.name,
          description: item.course?.description,
          modality: item.course?.modality,
          tags: item.course?.tags,
          status: item.status,
          enrolled_at: item.enrolled_at,
          start_course: item.course?.start_date,
          end_course: item.course?.end_date,
          identification_path: item.identification_path_base64,
          photo_path: item.photo_path_base64,
          receipt_path: item.receipt_path_base64,
          created_at: item.enrolled_at,
          pre_contract_path: item.pre_contract_path_base64,
        }));
        console.log(' this.objs', this.objs);
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
        title: 'Cancelar la matrícula',
        description: 'Se cancelará la matricula',
        loadingMsg: '... cancelando la matrícula',
        action: this.contractService.cancelEnrollment(this.selectedObj),
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
  }

  public onCloseAlert(): void {
    this.showAlert = false;
  }
}
