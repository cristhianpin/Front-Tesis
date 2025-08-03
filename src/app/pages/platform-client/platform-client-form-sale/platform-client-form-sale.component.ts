import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';

import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryTypeEnum } from '../../../@core/shared/enum/delivery-type.enum';
import { IPlatform } from '../../../@core/shared/model/platform.model';
import { CompanyService } from '../../../@core/shared/service/company.service';
import { PlatformCompanyService } from '../../../@core/shared/service/platform-company.service';
import { SaleService } from '../../../@core/shared/service/sale.service';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';

@Component({
  selector: 'ngx-platform-client-form-sale',
  templateUrl: './platform-client-form-sale.component.html',
  styleUrls: ['./platform-client-form-sale.component.scss'],
})
export class PlatformClientFormSaleComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //

  private obj: any;
  public platform: IPlatform;
  public profit: number;

  public showAlert = false;
  public isHaveBooking = false;

  public isConfirmAlert: boolean = false;
  public isWebAlert: boolean = false;
  public isInitialAlert: boolean = true;

  public messageConfirmAlert: string;
  public messageWebAlert: string = 'Ud. tiene cuentas disponibles por sus reservas.';
  public messageInitialAlert: string = 'Confirmar datos de transacción.';
  public messageNoWebAlert: string = 'Confirmar el método de entrega.';
  public messageReferenceWeb: string = 'En pantalla';

  public isConfirm: boolean = false;

  public selectedOption: string; // Variable para almacenar la opción seleccionada
  public selectOptionWhatsapp = false;
  public selectOptionMail = true;
  public selectOptionWeb = false;

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private platformCompanyService: PlatformCompanyService,
    private companyService: CompanyService,
    private saleService: SaleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconLibraries: NbIconLibraries,
    private communicationService: CommunicationService,
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
    this.platform = {} as IPlatform;

    super.setCRUDFlags(this.operation);
    // this.objForm = this.createDataForm(true);
    // if (!this.isCreate) {
    this.showSpinner = true;

    const platformCompany$ = this.platformCompanyService.findById(this.objIdModal).subscribe((res) => {
      if (res) {
        this.objModal = res.data[0];
        this.platform = this.objModal.Platform;
        this.platform.pricePublic = this.objModal.pricePublic;
        this.platform.cost = this.objModal.cost;

        this.logger.debug('objModal : ', this.objModal);

        this.objForm = this.createDataForm(this.isCreate);

        this.calculateProfit();

        this.showSpinner = false;
      }
    });
    this.subscriptions.push(platformCompany$);

    // }
  }

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      // id: new FormControl({
      //   value: create ? null : this.objModal.id,
      //   disabled: this.isReadOnly(),
      // }),
      reference: new FormControl(
        {
          value: this.objModal.reference,
          disabled: false,
        },
        [Validators.required],
      ),
      note: new FormControl(
        {
          value: this.objModal.note,
          disabled: false,
        },
        [],
      ),
      // platformId: new FormControl(
      //   {
      //     value: create ? null : this.objModal.platformId,
      //     disabled: this.isReadOnly(),
      //   },
      //   [Validators.required],
      // ),
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    // if (this.registeredBankInput.nativeElement.value) {
    //   this.objForm.get('registeredBank').setValue(this.registeredBankInput.nativeElement.value);
    // }

    this.logger.debug('Data Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }

    this.formsToModel();
    this.createObj();
  }

  private formsToModel(): void {
    this.obj = {
      deliveryType: this.selectedOption,
      reference: this.objForm.controls.reference.value,
      note: this.objForm.controls.note.value,
      // dni: this.objForm.controls.dni.value == undefined ? '' : this.objForm.controls.dni.value,
      // fullName: this.objForm.controls.customer.value == undefined ? '' : this.objForm.controls.customer.value,
      platformId: this.platform.id,
      count: 1,
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.saving';
    const saleCreate$ = this.saleService.createSale(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Created : ', res);
        if (this.isModal) {
          this.submitted = false;
          this.showSpinner = false;
          super.handleSuccessfulSaveObj(res);
          this.communicationService.createSaleComponent(res);
        } else {
          this.router.navigate([this.isCreate ? '../list' : '../../list'], {
            relativeTo: this.activatedRoute,
          });
        }
      }
    });
    this.subscriptions.push(saleCreate$);
  }

  get f(): any {
    return this.objForm.controls;
  }

  private getObjs(): void {
    this.obj = this.objForm.value;
  }

  public calculateProfit(): void {
    if (Number(this.platform.pricePublic && this.platform.cost)) {
      this.profit = Number(this.platform.pricePublic) - Number(this.platform.cost);
    } else {
      this.profit = 0;
    }
  }

  public onConfirm(): void {
    this.showSpinner = true;

    let objConfirm: any = {
      platformId: this.platform.id,
      count: 1,
    };

    setTimeout(() => {
      const platformCompany$ = this.companyService.verifyBalance(objConfirm).subscribe((res) => {
        if (res) {
          let verifyBalance: boolean = res.data.verify;
          let isHaveBooking: boolean = res.data.isHaveBooking;
          if (verifyBalance) {
            this.isConfirm = true;
            this.isConfirmAlert = false;
            this.isInitialAlert = false;

            if (isHaveBooking) {
              this.isHaveBooking = true;
              this.selectOptionWeb = true;
              this.selectOptionWhatsapp = false;
              this.selectOptionMail = false;
              this.isWebAlert = true;
              this.selectedOption = DeliveryTypeEnum.WEB;

              this.objForm.patchValue({
                reference: this.messageReferenceWeb,
              });
            } else {
              this.isHaveBooking = false;
              this.selectedOption = DeliveryTypeEnum.MAIL; // cambio cuando esté habilitado ws
            }
          } else {
            this.isConfirm = false;
            this.isConfirmAlert = true;
            this.messageConfirmAlert = res.data.message;
          }
          this.logger.debug('this.selectedOption: ', this.selectedOption);
          this.showSpinner = false;
        }
      });
      this.subscriptions.push(platformCompany$);
    });
  }

  updateSingleSelectGroupValue(evt): void {
    this.logger.debug('evt.target.value: ', evt.target.value);
    this.selectedOption = evt.target.value;

    if (this.selectedOption === DeliveryTypeEnum.WHATSAPP) {
      this.selectOptionWhatsapp = true;
      this.selectOptionWeb = false;
      this.selectOptionMail = false;

      this.objForm.patchValue({
        reference: '',
      });
    }

    if (this.selectedOption === DeliveryTypeEnum.MAIL) {
      this.selectOptionWhatsapp = false;
      this.selectOptionWeb = false;
      this.selectOptionMail = true;

      this.objForm.patchValue({
        reference: '',
      });
    }

    if (this.selectedOption === DeliveryTypeEnum.WEB) {
      this.selectOptionWhatsapp = false;
      this.selectOptionWeb = true;
      this.selectOptionMail = false;

      this.objForm.patchValue({
        reference: this.messageReferenceWeb,
      });
    }
  }

  // public onCloseAlert(): void {
  //   this.logger.debug('onCloseAlert');
  //   this.isConfirmAlert = false;
  // }

  // public onCloseWebAlert(): void {
  //   this.logger.debug('onCloseWebAlert');
  //   this.isWebAlert = false;
  // }

  // public onCloseInitialAlert(): void {
  //   this.logger.debug('onCloseWebAlert');
  //   this.isInitialAlert = false;
  // }
}
