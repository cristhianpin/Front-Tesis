import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { IPlatform } from '../../../@core/shared/model/platform.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { PlatformService } from '../../../@core/shared/service/platform.service';
import { EnumService } from '../../../@core/shared/service/enum.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';

@Component({
  selector: 'ngx-platform-list',
  templateUrl: './platform-list.component.html',
  styleUrls: ['./platform-list.component.scss'],
})
export class PlatformListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public platformTypes: string[];
  public showAlert = true;
  public pageSize = '5';

  @ViewChild('dt') table: Table;

  constructor(
    private platformService: PlatformService,
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
        field: 'code',
        header: 'Código',
        width: '25%',
        type: 'text',
        hide: true,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'image',
        header: 'Logo',
        width: '5%',
        type: 'boolean',
        exportable: true,
        filtrable: true,
        translate: true,
      },
      {
        field: 'name',
        header: 'Nombre',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'cost',
        header: 'Costo Natvi',
        width: '10%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'pricePublic',
        header: 'Precio Venta Sugerido',
        width: '17%',
        type: 'numeric',
        hide: true,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      // {
      //   field: 'profit',
      //   header: 'Ganancia Mayorista',
      //   width: '17%',
      //   type: 'numeric',
      //   exportable: true,
      //   filtrable: true,
      //   translate: false,
      // },
      {
        field: 'duration',
        header: 'Duración (días)',
        width: '17%',
        type: 'text',
        hide: false,
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'stockMin',
        header: 'Stock Mínimo',
        width: '17%',
        type: 'text',
        hide: false,
        exportable: false,
        filtrable: true,
        translate: false,
      },
      {
        field: 'expirationDays',
        header: 'Días expira',
        width: '17%',
        type: 'text',
        hide: false,
        exportable: false,
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
    const dataList$ = this.platformService.findAllAdm().subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.totalRecords = res.data.length;
        this.logger.debug('platform : ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  public delete(selectedObj): void {
    this.logger.debug('delete platform');
    this.logger.debug('this.selectedObj platform : ', selectedObj);

    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar plataforma',
        description: 'Se eliminarán todos sus datos y relacionados.',
        loadingMsg: '... Eliminando sus datos y relacionados.',
        action: this.platformService.delete(selectedObj),
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
        // this.find();
        this.initAll();
      }
    });
  }

  public onValueChange(event: boolean, id: string): void {
    this.logger.debug('onValueChange event');

    const platformEnable$ = this.platformService.findById(id).subscribe((res: any) => {
      if (res) {
        const platform: IPlatform = res.data[0];
        platform.isEnabled = event;
        this.platformService.update(platform).subscribe((resUpd) => {
          if (resUpd) {
            const updObj = resUpd.data;
            super.showToast('success', 'message.title.success', 'message.body.update-success');
            //this.showToast('success', 'Éxito', 'Registro actualuzado correctamente');
            //super.setSelectedObj(updObj.id);
          }
        });
      }
    });
    //this.subscriptions.push(platformEnable$);
  }

  public onCloseAlert(): void {
    this.showAlert = false;
  }
}
