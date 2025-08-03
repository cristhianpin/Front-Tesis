import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { StatementAccountService } from '../../../@core/shared/service/statement-account.service';

@Component({
  selector: 'ngx-statement-account-list',
  templateUrl: './statement-account-list.component.html',
  styleUrls: ['./statement-account-list.component.scss'],
})
export class StatementAccountListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;

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
        field: 'code_unique',
        header: 'Código Único',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'project',
        header: 'Proyecto',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'stage',
        header: 'Etapa',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'model',
        header: 'Modelo',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'location',
        header: 'Ubicación',
        width: '25%',
        type: 'text',
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
    const dataList$ = this.statementAccountService.property().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs.forEach((item) => {
          item.customer_identification = item?.client_detail?.identification;
          item.customer_name = item?.client_detail?.client;
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
