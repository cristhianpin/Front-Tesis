import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { IPlatform } from '../../../@core/shared/model/platform.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { SettingService } from '../../../@core/shared/service/setting.service';
import { getRoleLabel } from '../../../@core/shared/enum/role.enum';

@Component({
  selector: 'ngx-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss'],
})
export class SettingListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;

  @ViewChild('dt') table: Table;

  constructor(
    private settingService: SettingService,
    private communicationService: CommunicationService,
    private cd: ChangeDetectorRef,
  ) {
    super('platform');
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

  // private refreshTable() {
  //   this.cd.detectChanges();
  //   this.table.reset();
  //   this.table.saveState();
  //   this.cd.detectChanges();
  // }

  private initAll(): void {
    this.logger.debug('initAll');

    this.initValues();
    this.initTable();
    //this.refreshTable();
  }

  private initValues(): void {
    // set multiselect records table
    this.multiSelectRecordDisabled = false;

    // this.pageSize = this.tablePreference.pageSize;

    super.setSelectedObj(null);
    super.initBaseValues();
    this.initSubscriptors();
    //this.initListBoxes();
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
    // this.listPlatformTypes();
  }

  // private listPlatformTypes(): void {
  //   const platformTypes$ = this.enumService.listPlatformType().subscribe((res: any) => {
  //     if (res) {
  //       this.platformTypes = res;
  //       this.logger.debug('platform types : ', this.platformTypes);
  //     }
  //   });
  //   this.subscriptions.push(platformTypes$);
  // }

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'name',
        header: 'Nombre',
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
        field: 'key',
        header: 'Código',
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
    const dataList$ = this.settingService.index().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.objs.forEach((item) => {
          item.isEnabled = item?.is_enabled === '1' ?? false;
        });
        this.totalRecords = res.data.length;
        this.logger.debug('platform : ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  public onValueChange(event: boolean, id: string): void {
    this.logger.debug('onValueChange event');

    const suscription$ = this.settingService.findById(id).subscribe((res: any) => {
      if (res) {
        const platform: IPlatform = res.data[0];
        platform.isEnabled = event;
        this.settingService.update(platform).subscribe((resUpd) => {
          if (resUpd) {
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
