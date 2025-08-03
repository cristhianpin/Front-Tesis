import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';

import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';
import { PlatformCompanyService } from '../../../@core/shared/service/platform-company.service';

@Component({
  selector: 'ngx-platform-company-search-modal',
  templateUrl: 'platform-company-search-modal.component.html',
  styleUrls: ['platform-company-search-modal.component.scss'],
})
export class PlatformCompanySearchModalComponent extends BaseListComponent implements OnInit, OnDestroy {
  @Input() companyId?: string;

  public selectedPlatformCompany: IPlatformCompany;
  public totalRecords: number;

  public showAlert = true;

  public loading = false;
  public globalFilterBtnDisabled = true;
  public filterFieldGlobal: string;

  public isSearch: boolean;

  constructor(
    protected dialogRef: NbDialogRef<PlatformCompanySearchModalComponent>,
    private platformCompanyService: PlatformCompanyService,
  ) {
    super('platform-company-search');
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
        field: 'platformCode',
        header: 'Código',
        width: '15%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'platformImage',
        header: 'Logo',
        width: '5%',
        type: 'boolean',
        exportable: true,
        filtrable: true,
        translate: true,
      },
      {
        field: 'platformName',
        header: 'Nombre',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'cost',
        header: 'Costo Mayorista',
        width: '15%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'pricePublic',
        header: 'Precio Venta Sugerido',
        width: '20%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'platformProfit',
        header: 'Ganancia',
        width: '15%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      // {
      //   field: 'isEnabled',
      //   header: 'Habilitado',
      //   width: '5%',
      //   type: 'boolean',
      //   exportable: true,
      //   filtrable: true,
      //   translate: true,
      // },
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
    const platforms$ = this.platformCompanyService.findAllByCompanyId(this.companyId, 'enabled').subscribe((res: any) => {
      if (res) {
        this.objs = res.data;

        this.objs.forEach((item) => {
          item.platformId = item.Platform.id;
          item.platformCode = item.Platform.code;
          item.platformName = item.Platform.name;
          item.platformPrice = item.Platform.price;
          item.platformCost = item.Platform.cost;
          item.platformPricePublic = item.Platform.pricePublic;
          // item.platformProfit = Number(item.pricePublic) - Number(item.Platform.price);
          item.platformProfit = Number(item.pricePublic) - Number(item.cost);
          item.platformImage = item.Platform.image;
          item.companyId = item.Company.id;
          item.companyName = item.Company.name;
          item.cost = item.cost;
          item.pricePublic = item.pricePublic;
          item.isEnabled = item.isEnabled;
          item.createdAt = item.createdAt;
          item.createdBy = item.createdBy;
          item.updatedAt = item.updatedAt;
          item.updatedBy = item.updatedBy;
        });

        this.totalRecords = res.length;
        this.logger.debug('platforms : ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(platforms$);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public selectRow(): void {
    if (this.selectedPlatformCompany) {
      this.logger.debug('selected platform-company : ', this.selectedPlatformCompany);
      this.dialogRef.close(this.selectedPlatformCompany);
    }
  }

  public onCloseAlert(): void {
    this.showAlert = false;
  }
}
