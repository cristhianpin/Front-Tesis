import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';

import { ActivatedRoute, Router } from '@angular/router';
import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';
import { IPlatform } from '../../../@core/shared/model/platform.model';
import { PlatformCompanyService } from '../../../@core/shared/service/platform-company.service';

@Component({
  selector: 'ngx-platform-company-form',
  templateUrl: './platform-company-form.component.html',
  styleUrls: ['./platform-company-form.component.scss'],
})
export class PlatformCompanyFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //

  private obj: IPlatformCompany;
  public platform: IPlatform;
  public profit: number;

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private platformCompanyService: PlatformCompanyService,
    private router: Router,
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
    this.platform = {} as IPlatform;

    super.setCRUDFlags(this.operation);
    this.objForm = this.createDataForm(true);
    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const platformCompany$ = this.platformCompanyService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.objModal = res.data[0];
            // this.obj = this.objModal;
            this.platform = this.objModal.Platform;

            this.logger.debug('objModal : ', this.objModal);
            this.logger.debug('platform : ', this.platform);

            this.objForm = this.createDataForm(this.isCreate);

            this.calculateProfit();

            this.showSpinner = false;
          }
        });
        this.subscriptions.push(platformCompany$);
      });
    }
  }

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      cost: new FormControl(
        {
          value: create ? null : this.objModal.cost,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
      pricePublic: new FormControl(
        {
          value: create ? null : this.objModal.pricePublic,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
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

    if (this.isCreate) {
      this.createObj();
    } else if (this.isUpdate) {
      this.updateObj();
    }
  }

  private formsToModel(): void {
    this.obj = {
      id: this.objForm.controls.id.value,
      cost: this.objForm.controls.cost.value,
      pricePublic: this.objForm.controls.pricePublic.value,
    };
  }

  private formsToSale(): void {
    this.obj = {
      id: this.objForm.controls.id.value,
      pricePublic: this.objForm.controls.pricePublic.value,
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.saving';
    const platformCompanyCreate$ = this.platformCompanyService.create(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Created : ', res);
        if (this.isModal) {
          super.handleSuccessfulSaveObj(res);
        } else {
          this.router.navigate([this.isCreate ? '../list' : '../../list'], {
            relativeTo: this.activatedRoute,
          });
        }
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(platformCompanyCreate$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.updating';
    const platformCompanyUpdate$ = this.platformCompanyService.update(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Updated : ', res);
        if (this.isModal) {
          super.handleSuccessfulEditObj(res);
          // this.communicationService.updatePlatformCompanyComponent(res.data[0]);
        } else {
          this.router.navigate([this.isCreate ? '../list' : '../../list'], {
            relativeTo: this.activatedRoute,
          });
        }
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(platformCompanyUpdate$);
  }

  public onSale(): void {
    this.logger.debug('onSale');
    this.submitted = true;

    this.formsToSale();
  }

  get f(): any {
    return this.objForm.controls;
  }

  public onInputDecimal(evt: any): void {
    this.logger.debug('onInputDecimal, evt.target.value: ', evt.target.value);
    if (!this.isDecimalKey(evt)) {
      evt.preventDefault();
      this.getObjs();
    }
    this.getObjs();
    this.calculateProfit();
  }

  private getObjs(): void {
    this.obj = this.objForm.value;
  }

  public calculateProfit(): void {
    if (Number(this.objForm.controls.pricePublic.value) && Number(this.objForm.controls.cost.value)) {
      this.profit = Number(this.objForm.controls.pricePublic.value) - Number(this.objForm.controls.cost.value);
    } else {
      this.profit = 0;
    }
  }
}
