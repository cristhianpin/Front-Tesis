import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { Table } from 'primeng/table';
import { StatementAccountService } from '../../../@core/shared/service/statement-account.service';
import {
  ApprovalDialogComponent
} from '../../pending-payment/pending-payment-status/approval/approval-dialog.component';
import { RejectCommentDialogComponent } from '../reject-comment-form/reject-comment-dialog.component';

@Component({
  selector: 'ngx-reject-payment-list',
  templateUrl: './reject-payment-list.component.html',
  styleUrls: ['./reject-payment-list.component.scss'],
})
export class RejectPaymentListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;
  public comments: any[] = [];
  @ViewChild('dt') table: Table;

  constructor(private statementAccountService: StatementAccountService, private communicationService: CommunicationService) {
    super('statement-account');
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
        field: 'customer_name',
        header: 'Cliente',
        width: '50%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'customer_identification',
        header: 'Identificación',
        width: '30%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'project',
        header: 'Proyecto',
        width: '30%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'stage',
        header: 'Etapa',
        width: '30%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'location',
        header: 'Ubicación',
        width: '30%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'amount',
        header: 'Valor de pago',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'voucher_file_base64',
        header: 'Documento',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'reference',
        header: 'Referencia',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'payment_date',
        header: 'Fecha de pago',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'created_at',
        header: 'Fecha de ingreso',
        width: '25%',
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

  public handleRowSelect(event: any): void {
    this.comments = event.data.comments;
    const newEvent = { ...event, data: { ...event.data, id: event.data.property_detail_id } };
    this.onRowSelect(newEvent);
  }

  public onRowSelect(event: any): void {
    console.log('Nuevo ID asignado:', event.data.id);
    super.onRowSelect(event);
  }

  public rejectComment(comments: []): void {
    const modal = this.dialogService.open(RejectCommentDialogComponent, {
      context: {
        comments: comments,
        title: 'Motivos de Rechazo',
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

  private findAll(): void {
    this.logger.debug('find all');
    this.objs = [];
    this.showSpinner = true;
    const dataList$ = this.statementAccountService.payment('RECHAZADO').subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs.forEach((item) => {
          item.customer_name = item?.property_detail?.client_detail?.client;
          item.customer_identification = item?.property_detail?.client_detail?.identification;
          item.project = item?.property_detail?.project;
          item.stage = item?.property_detail?.stage;
          item.model = item?.property_detail?.model;
          item.location = item?.property_detail?.location;
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

  public onCloseAlert(): void {
    this.showAlert = false;
  }
}
