import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { NbDialogRef, NbIconLibraries } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';

import { ActivatedRoute, Router } from '@angular/router';
import { IAccount } from '../../../@core/shared/model/account.model';
import { IPlatform } from '../../../@core/shared/model/platform.model';
import { AccountService } from '../../../@core/shared/service/account.service';
import { CompanyService } from '../../../@core/shared/service/company.service';
import { PlatformCompanyService } from '../../../@core/shared/service/platform-company.service';
import { SaleService } from '../../../@core/shared/service/sale.service';
import { StatusAccountEnum } from '../../../@core/shared/enum/status-account.enum';

@Component({
  selector: 'ngx-platform-client-form-view',
  templateUrl: './platform-client-form-view.component.html',
  styleUrls: ['./platform-client-form-view.component.scss'],
})
export class PlatformClientFormViewComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //

  public obj: any = {};
  public messageWebAlert: string = 'Información detallada de la cuenta vendida.';
  public isShowAlert: boolean = true;

  // public messagePending: string = 'Esta cuenta está pendiente de gestionar.';
  public messagePending: string = 'En pocos minutos, estará lista su cuenta. Gracias!';
  public messagePendingOutHours: string = 'Desde las 7AM, se gestionará su cuenta. Gracias!';
  public isShowPending: boolean = false;

  public showForm: boolean = false;

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private iconLibraries: NbIconLibraries,
  ) {
    super(activeDialog);
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fas', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.activatedRoute.data.subscribe((data) => {
      this.operation = data['operation'] ? data['operation'] : this.operation;
    });

    this.activatedRoute.params.subscribe((params) => {
      this.objIdModal = params['objId'] ? params['objId'] : this.objIdModal;
    });
    this.printInputVals();
    this.initValues();
  }

  ngAfterViewInit(): void {
    this.logger.debug('ngAfterViewInit');
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private printInputVals(): void {
    super.printInputValues();
  }

  private initValues(): void {
    super.setCRUDFlags(this.operation);

    if (this.validateOutHours()) {
      this.messagePending = this.messagePendingOutHours;
    } else {
      this.messagePending = this.messagePending;
    }

    this.showSpinner = true;

    const platformCompany$ = this.accountService.findById(this.objIdModal).subscribe((res) => {
      if (res) {
        // this.obj = res.data[0];
        this.obj = {
          image: res.data[0].Platform.image,
          desc: res.data[0].Platform.description,
          account: res.data[0].account,
          password: res.data[0].password,
          code: res.data[0].code,
          deliveryType: res.data[0].deliveryType,
          duration: res.data[0].status === StatusAccountEnum.PENDING ? '---' : res.data[0].validityUntil + ' días',
          status: res.data[0].status,
        };

        if (this.obj.status === StatusAccountEnum.PENDING) {
          this.isShowAlert = false;
          this.isShowPending = true;
        }

        // Espera 2 segundos antes de ejecutar una acción
        setTimeout(() => {
          this.showSpinner = false;
          this.showForm = true;
        }, 500);
      }
    });
    this.subscriptions.push(platformCompany$);

    // }
  }

  get f(): any {
    return this.objForm.controls;
  }

  validateOutHours(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    this.logger.debug('currentHour', currentHour);

    // Realiza la validación
    if (currentHour >= 22 || currentHour <= 7) {
      // Devuelve el mensaje si la hora está en el rango deseado
      return true;
    } else {
      // Devuelve el mensaje si la hora no está en el rango deseado
      return false;
    }
  }
}
