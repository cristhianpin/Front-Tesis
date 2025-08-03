import { AfterViewInit, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { IAccount } from '../../../@core/shared/model/account.model';
import { AccountService } from '../../../@core/shared/service/account.service';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { CompanyService } from '../../../@core/shared/service/company.service';
import { ICompany } from '../../../@core/shared/model/company.model';
import { CompanySearchModalComponent } from '../../company/company-search-modal/company-search-modal.component';
import { StatusAccountEnum } from '../../../@core/shared/enum/status-account.enum';
import { PlatformCompanySearchModalComponent } from '../../platform-company/platform-company-search-modal/platform-company-search-modal.component';
import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';

@Component({
  selector: 'ngx-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //
  private obj: IAccount;
  public companies: ICompany[];
  public selectedCompany: ICompany;
  public selectedPlatformCompany: IPlatformCompany;
  public showCompanyInfo = false;
  public showPlatformCompanyInfo = false;
  public selectedCompanyAlert = false;
  public listStatusAccountEnum: string[] = Object.values(StatusAccountEnum);
  public selectedTabId = '';

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconLibraries: NbIconLibraries,
    private companyService: CompanyService,
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
    this.initList();
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
    this.objForm = this.createDataForm(true);
    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const platformCompany$ = this.accountService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.objModal = res.data[0];
            this.objModal.companyId = res.data[0].Company.id;
            this.objModal.companyTxt = res.data[0].Company.name;
            this.objModal.platformId = res.data[0].Platform.id;
            this.objModal.platformTxt = res.data[0].Platform.name;
            this.objModal.duration = res.data[0].Platform.duration;
            this.objModal.cost = res.data[0].Platform.cost;

            // this.objModal.Company = res.data[0].Company;
            // this.objModal.Platform = res.data[0].Platform;

            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createDataForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(platformCompany$);
      });
    } else {
      this.objForm.patchValue({
        status: StatusAccountEnum.ONHOLD,
      });

      const dataList$ = this.accountService.findAllAdm().subscribe((res: any) => {
        if (res) {
          this.objForm.patchValue({
            code: '' + res.data.length,
          });
        }
      });
    }
  }

  private initList(): void {
    this.findCompanies();
  }

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      account: new FormControl(
        {
          value: create ? null : this.objModal.account,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      password: new FormControl(
        {
          value: create ? null : this.objModal.password,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      code: new FormControl(
        {
          value: create ? null : this.objModal.code,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      cost: new FormControl(
        {
          value: create ? null : this.objModal.cost,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
      screen: new FormControl(
        {
          value: create ? null : this.objModal.screen,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      reference: new FormControl(
        {
          value: create ? null : this.objModal.reference,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      status: new FormControl(
        {
          value: create ? null : this.objModal.status,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      phone: new FormControl(
        {
          value: create ? null : this.objModal.phone,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      companyTxt: new FormControl(
        {
          value: create ? null : this.objModal.companyTxt,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      companyId: new FormControl(
        {
          value: create ? null : this.objModal.companyId,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      platformTxt: new FormControl(
        {
          value: create ? null : this.objModal.platformTxt,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      platformId: new FormControl(
        {
          value: create ? null : this.objModal.platformId,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
    });
  }

  private findCompanies(): void {
    this.logger.debug('findCompanies');
    const companies$ = this.companyService.findAllAdm().subscribe((res: any) => {
      if (res) {
        this.companies = res.data;
        this.logger.debug('companies : ', this.companies);
      }
    });
    this.subscriptions.push(companies$);
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
      account: this.objForm.controls.account.value,
      password: this.objForm.controls.password.value,
      screen: this.objForm.controls.screen.value,
      code: this.objForm.controls.code.value,
      reference: this.objForm.controls.reference.value,
      phone: this.objForm.controls.phone.value,
      status: this.objForm.controls.status.value,
      companyId: this.objForm.controls.companyId.value,
      platformId: this.objForm.controls.platformId.value,
      cost: this.objForm.controls.cost.value,
      validityUntil: this.objModal.loadedAt
        ? this.calculateVigency(this.objModal.loadedAt, Number(this.objModal.duration)).remainingDays
        : 0,
    };
  }

  calculateVigency(saleAt: Date, durationInDays: number): { isExpired: boolean; remainingDays: number } {
    const currentDate = new Date();
    const expirationDate = new Date(saleAt);
    expirationDate.setDate(expirationDate.getDate() + durationInDays);

    const remainingMilliseconds = expirationDate.getTime() - currentDate.getTime();
    let remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));

    if (remainingDays <= 0) {
      remainingDays = 0;
    }

    const isExpired = remainingDays <= 0;

    return { isExpired, remainingDays };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.saving';

    const platformCompanyCreate$ = this.accountService.create(this.obj).subscribe((res) => {
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
    const platformCompanyUpdate$ = this.accountService.update(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Updated : ', res[0]);
        if (this.isModal) {
          super.handleSuccessfulEditObj(res);
          // this.communicationService.updateAccountComponent(res.data[0]);
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

  get f(): any {
    return this.objForm.controls;
  }

  public onOpenCompanySearch(): void {
    this.logger.debug('onOpenCompanySearch');
    this.dialogService
      .open(CompanySearchModalComponent, {
        // context: {
        //   bic: this.selectedSucursalId,
        // },
        autoFocus: false,
        hasScroll: true,
        hasBackdrop: true,
        closeOnEsc: false,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((sel) => {
        if (sel) {
          this.logger.debug('selected record in dialog : ', sel);
          this.selectedCompany = sel;
          this.showCompanyInfo = true;
          this.objForm.get('companyTxt').setValue(this.selectedCompany.name);
          this.objForm.get('companyId').setValue(this.selectedCompany.id);
          this.selectedCompanyAlert = false;
        } else {
          this.showCompanyInfo = false;
        }
      });
  }

  public onOpenPlatformSearch(): void {
    this.logger.debug('onOpenPlatformSearch');
    let companyId;
    if (this.isUpdate) {
      if (this.objForm.controls.companyId.value != '') {
        companyId = this.objForm.controls.companyId.value;
      } else {
        this.selectedCompanyAlert = true;
        return;
      }
    } else {
      if (this.selectedCompany) {
        companyId = this.selectedCompany.id;
      } else {
        this.selectedCompanyAlert = true;
        return;
      }
    }

    this.dialogService
      .open(PlatformCompanySearchModalComponent, {
        context: {
          companyId: companyId,
        },
        autoFocus: false,
        hasScroll: true,
        hasBackdrop: true,
        closeOnEsc: false,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((sel) => {
        if (sel) {
          this.logger.debug('onOpenPlatformSearch selected record in dialog : ', sel);
          this.selectedPlatformCompany = sel;
          this.showPlatformCompanyInfo = true;
          this.selectedCompanyAlert = false;
          this.objForm.get('cost').setValue(this.selectedPlatformCompany.Platform.cost);
          this.objForm.get('platformTxt').setValue(this.selectedPlatformCompany.Platform.name);
          this.objForm.get('platformId').setValue(this.selectedPlatformCompany.Platform.id);
        } else {
          this.showPlatformCompanyInfo = false;
        }
      });
  }

  public onChangeTab(evt: any): void {
    this.logger.debug('onChangeTab : ', evt);
    this.selectedTabId = evt.tabId;
  }

  public back(): void {
    if (this.isCreate) {
      this.router.navigate(['../list'], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this.router.navigate(['../../list'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  public onInputDecimal(evt: any): void {
    this.logger.debug('onInputDecimal, evt.target.value: ', evt.target.value);
    if (!this.isDecimalKey(evt)) {
      evt.preventDefault();
      this.getObjs();
    }
    this.getObjs();
  }

  private getObjs(): void {
    this.obj = this.objForm.value;
  }
}
