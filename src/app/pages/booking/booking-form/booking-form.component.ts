import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDateService, NbDialogRef, NbIconLibraries } from '@nebular/theme';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { BookingCountAdminEnum, BookingCountEnum } from '../../../@core/shared/enum/booking-count.enum';
import { IBooking } from '../../../@core/shared/model/booking.model';
import { ICompany } from '../../../@core/shared/model/company.model';
import { IPlatformCompany } from '../../../@core/shared/model/platform-company.model';
import { BookingService } from '../../../@core/shared/service/booking.service';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { CompanySearchModalComponent } from '../../company/company-search-modal/company-search-modal.component';
import { PlatformCompanySearchModalComponent } from '../../platform-company/platform-company-search-modal/platform-company-search-modal.component';

@Component({
  selector: 'ngx-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //
  private obj: IBooking;
  // public companies: ICompany[];
  // public platforms: any[];

  public selectedCompany: ICompany;
  public selectedPlatformCompany: IPlatformCompany;
  public showCompanyInfo = false;
  public showPlatformCompanyInfo = false;
  public selectedCompanyAlert = false;
  public selectedTabId = '';
  public cId: string;

  public isAlertError = false;
  public messageAlertError: string;

  public isAlertInit = true;
  public messageAlertInit: string = 'Verificar! Esta acción no tiene reverso.';

  public untilAtTxt: string = '';
  public listBookingCountEnum: string[] = Object.values(BookingCountEnum);
  public listBookingCountAdminEnum: string[] = Object.values(BookingCountAdminEnum);

  min: Date;
  max: Date;

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private bookingService: BookingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconLibraries: NbIconLibraries,
    private communicationService: CommunicationService, // protected dateService: NbDateService<Date>,
  ) {
    super(activeDialog);
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fas', iconClassPrefix: 'fa' });

    this.min = new Date(new Date()); // Fecha actual

    this.min.setDate(this.min.getDate() + (this.isRoot ? -5 : -1)); // Fecha actual + 1 díasdd44

    this.max = new Date();
    this.max.setDate(this.max.getDate() + 10); // Fecha actual + 10 días
    this.logger.debug('min: ', this.min);
    this.logger.debug('max: ', this.max);
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

    this.cId = localStorage.getItem('cId');

    if (this.isRoot) {
      this.listBookingCountEnum = this.listBookingCountAdminEnum;
    }

    this.objForm = this.createDataForm(true);
    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const booking$ = this.bookingService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.objModal = res.data[0];
            // this.objModal.companyId = res.data[0].Company.id;
            // this.objModal.companyTxt = res.data[0].Company.name;
            this.objModal.platformId = res.data[0].Platform.id;
            this.objModal.platformTxt = res.data[0].Platform.name;

            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createDataForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(booking$);
      });
    } else {
      // const dataList$ = this.bookingService.findAllAdm().subscribe((res: any) => {
      //   if (res) {
      //     this.objForm.patchValue({
      //       code: '' + res.data.length,
      //     });
      //   }
      // });
    }
  }

  private initList(): void {}

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      code: new FormControl(
        {
          value: create ? null : this.objModal.code,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      count: new FormControl(
        {
          value: create ? null : this.objModal.count,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      fromAt: new FormControl(
        {
          value: create ? null : this.objModal.fromAt,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      untilAt: new FormControl(
        {
          value: create ? null : this.objModal.untilAt,
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
      count: Number(this.objForm.controls.count.value),
      fromAt: this.objForm.controls.fromAt.value.toISOString().split('T')[0],
      untilAt: this.untilAtTxt,
      platformId: this.objForm.controls.platformId.value,
      companyId: this.cId,
    };
    this.logger.debug('formsToModel, this.obj: ', this.obj);
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.saving';

    const bookingCreate$ = this.bookingService.create(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Created : ', res);
        if (res.code == 200 || res.code == 201) {
          if (this.isModal) {
            if (res.data.isVerify) {
              super.handleSuccessfulSaveObj(res);
              this.communicationService.createBookingComponent(res);
            } else {
              this.showSpinner = false;
              this.isAlertError = true;
              this.isAlertInit = false;
              this.messageAlertError = res.data.message;
            }
          } else {
            this.router.navigate([this.isCreate ? '../list' : '../../list'], {
              relativeTo: this.activatedRoute,
            });
          }
        } else {
          this.showSpinner = false;
          this.isAlertError = true;
          this.isAlertInit = false;
          this.messageAlertError = res.data.message;
        }
      }
    });
    this.subscriptions.push(bookingCreate$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.updating';
    const bookingUpdate$ = this.bookingService.update(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Updated : ', res[0]);
        if (this.isModal) {
          super.handleSuccessfulEditObj(res);
          // this.communicationService.updateBookingComponent(res.data[0]);
        } else {
          this.router.navigate([this.isCreate ? '../list' : '../../list'], {
            relativeTo: this.activatedRoute,
          });
        }
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(bookingUpdate$);
  }

  get f(): any {
    return this.objForm.controls;
  }

  public onOpenPlatformSearch(): void {
    this.logger.debug('onOpenPlatformSearch');
    // let companyId;
    // if (this.isUpdate) {
    //   if (this.objForm.controls.companyId.value != '') {
    //     companyId = this.objForm.controls.companyId.value;
    //   } else {
    //     this.selectedCompanyAlert = true;
    //     return;
    //   }
    // } else {
    //   if (this.selectedCompany) {
    //     companyId = this.selectedCompany.id;
    //   } else {
    //     this.selectedCompanyAlert = true;
    //     return;
    //   }
    // }

    this.dialogService
      .open(PlatformCompanySearchModalComponent, {
        context: {
          companyId: this.cId,
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

  public updateUntilAt(selectedDate: Date) {
    // Aquí puedes acceder a la fecha seleccionada, que es la variable selectedDate.
    this.logger.debug('updateUntilAt, selectedDate: ', selectedDate);
    this.untilAtTxt = selectedDate.toISOString().split('T')[0];
    this.logger.debug('updateUntilAt, this.untilAt: ', this.untilAtTxt);
    // Realiza las acciones que desees con la fecha seleccionada.

    this.objForm.patchValue({
      fromAt: this.untilAtTxt,
    });
  }

  public onCloseAlertError(): void {
    this.isAlertError = false;
  }

  public onCloseAlertInit(): void {
    this.isAlertInit = false;
  }
}
