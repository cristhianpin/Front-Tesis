import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../@core/shared/component/base-list.component';

import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { MovementService } from '../../../@core/shared/service/movement.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { MovementFormComponent } from '../movement-form/movement-form.component';

@Component({
  selector: 'ngx-movement-list',
  templateUrl: './movement-list.component.html',
  styleUrls: ['./movement-list.component.scss'],
})
export class MovementListComponent extends BaseListComponent implements OnInit, OnDestroy {
  @Input() companyId?: string;
  @Input() origin?: string;

  public uuid: string;
  public cIdL: string = '';
  public originL: string = '';
  public showAlert = true;

  constructor(private movementService: MovementService, private communicationService: CommunicationService) {
    super('movement');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.initTable();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private initAll(): void {
    this.logger.debug('initAll');

    this.initValues();
    this.initTable();
  }

  private initValues(): void {
    // set multiselect records table
    this.multiSelectRecordDisabled = false;

    //this.selectedObj = this.selectedObj === undefined ? this.companyId : this.selectedObj;

    // get companyId
    if (this.companyId) {
      this.cIdL = this.companyId;
    } else {
      this.cIdL = localStorage.getItem('cId');
      this.logger.debug('localStorage, companyId: ', this.cIdL);
    }

    if (this.origin == 'internal') {
      this.originL = 'internal';
    } else {
      this.originL = 'external';
    }

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

    const createRecord$ = this.communicationService.movementComponent.subscribe((res) => {
      if (res) {
        this.destroySubscriptors();
        this.initAll();
      }
    });
    this.subscriptions.push(createRecord$);

    const updateRecord$ = this.communicationService.movementComponent.subscribe((res) => {
      if (res) {
        this.destroySubscriptors();
        this.initAll();
      }
    });
    this.subscriptions.push(updateRecord$);
  }

  private initListBoxes(): void {
    // this.listMovementTypes();
  }

  // private listMovementTypes(): void {
  //   const platformTypes$ = this.enumService.listMovementType().subscribe((res: any) => {
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
        width: '5%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'name',
        header: 'Motivo',
        width: '25%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'description',
        header: 'Observación',
        width: '10%',
        type: 'text',
        hide: false,
        exportable: true,
        filtrable: true,
        translate: true,
      },
      {
        field: 'action',
        header: 'Acción',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'type',
        header: 'Tipo',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'value',
        header: 'Monto',
        width: '10%',
        type: 'numeric',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'balance',
        header: 'Balance',
        width: '10%',
        type: 'numeric',
        exportable: false,
        filtrable: false,
        translate: false,
      },
      {
        field: 'createdAt',
        header: 'Creación',
        width: '10%',
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

  private findAll(): void {
    this.logger.debug('find all');
    this.objs = [];

    this.showSpinner = true;
    const dataList$ = this.movementService.findAllByCompanyId(this.cIdL).subscribe((res: any) => {
      if (res) {
        this.objs = res.data;
        this.totalRecords = res.data.length;
        this.logger.debug('movement: ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  public delete(): void {
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj.id,
        title: 'Eliminar movimiento',
        description: 'Se eliminará el movimiento ' + this.selectedObj.fiscalName,
        loadingMsg: '... eliminando el movimiento ' + this.selectedObj.fiscalName,
        action: this.movementService.delete(this.selectedObj.id),
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

  public onOpenForm(selectedObj: any, operation: string): void {
    this.logger.debug('onOpenForm');
    this.logger.debug('onOpenForm, selectedObj:', selectedObj);

    const modal = this.dialogService.open(MovementFormComponent, {
      context: {
        operation: operation,
        objIdModal: selectedObj,
        modalStyle: 'width: 30em; height: 35em;',
        modalSeverity: 'primary',
        isModal: true,
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      this.logger.debug('close modal in open method: ', res);
      if (res) {
      }
    });
  }

  public onCloseAlert(): void {
    this.logger.debug('onCloseAlert');
    this.showAlert = false;
  }
}
