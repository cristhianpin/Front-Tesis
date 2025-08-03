import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { ICompany } from '../../../@core/shared/model/company.model';
import { CompanyService } from '../../../@core/shared/service/company.service';

@Component({
  selector: 'ngx-company-search-modal',
  templateUrl: 'company-search-modal.component.html',
  styleUrls: ['company-search-modal.component.scss'],
})
export class CompanySearchModalComponent extends BaseListComponent implements OnInit, OnDestroy {
  public selectedCompany: ICompany;
  public totalRecords: number;

  public loading = false;
  public globalFilterBtnDisabled = true;
  public filterFieldGlobal: string;

  public isSearch: boolean;

  constructor(protected dialogRef: NbDialogRef<CompanySearchModalComponent>, private companyService: CompanyService) {
    super('company-search');
    this.logger.debug('constructor search');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.initTable();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    super.destroySubscriptors();
  }

  private initValues(): void {
    super.setSelectedObj(null);
    super.initBaseValues();
    this.initList();
  }

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'code',
        header: 'Código',
        width: '15%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'name',
        header: 'Nombre',
        width: '30%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'balance',
        header: 'Balance',
        width: '20%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'nick',
        header: 'Nickname',
        width: '20%',
        type: 'text',
        hide: false,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'isEnabled',
        header: 'Habilitado',
        width: '20%',
        type: 'bool',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'createdAt',
        header: 'Creación',
        width: '30%',
        type: 'date',
        hide: false,
        exportable: true,
        filtrable: true,
        translate: false,
      },
    ];
    super.initTableProperties();
  }

  private initList(): void {
    this.logger.debug('init list');
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
        this.totalRecords = res.length;
        this.logger.debug('companies : ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(companies$);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public selectRow(): void {
    if (this.selectedCompany) {
      this.logger.debug('selected company : ', this.selectedCompany);
      this.dialogRef.close(this.selectedCompany);
    }
  }
}
