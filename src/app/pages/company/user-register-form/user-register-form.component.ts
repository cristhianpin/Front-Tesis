import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { IUserRegister } from '../../../@core/shared/model/user-register.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { UserService } from '../../../@core/shared/service/user.service';

@Component({
  selector: 'ngx-user-register-form',
  templateUrl: './user-register-form.component.html',
  styleUrls: ['./user-register-form.component.scss'],
})
export class UserRegisterFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //
  private obj: IUserRegister;

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private userRegisterService: UserService,
    private iconLibraries: NbIconLibraries,
  ) {
    super(activeDialog);
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fas', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
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
    this.objForm = this.createDataForm(true);

    // if (!this.isCreate) {
    //   this.showSpinner = true;
    //   setTimeout(() => {
    //     const user-register$ = this.userRegisterService.findById(this.objIdModal).subscribe((res) => {
    //       if (res) {
    //         this.objModal = res.data[0];
    //         this.logger.debug('initValues, objModal : ', this.objModal);
    //         this.objForm = this.createDataForm(this.isCreate);
    //         this.showSpinner = false;
    //       }
    //     });
    //     this.subscriptions.push(user-register$);
    //   });
    // } else {
    //   const dataList$ = this.user-registerService.findAllByCompanyId(this.objIdModal).subscribe((res: any) => {
    //     if (res) {
    //       this.objForm.patchValue({
    //         code: '' + res.data.length,
    //       });
    //     }
    //   });
    // }
  }

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      firstName: new FormControl(
        {
          value: create ? null : this.objModal.firstName,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.minLength(3)],
      ),
      lastName: new FormControl(
        {
          value: create ? null : this.objModal.lastName,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.minLength(3)],
      ),
      email: new FormControl(
        {
          value: create ? null : this.objModal.email,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.email],
      ),
      password: new FormControl(
        {
          value: create ? null : this.objModal.password,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.minLength(8)],
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
    }
  }

  private formsToModel(): void {
    this.obj = {
      id: this.objForm.controls.id.value,
      firstName: this.objForm.controls.firstName.value,
      lastName: this.objForm.controls.lastName.value,
      email: this.objForm.controls.email.value,
      password: this.objForm.controls.password.value,
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.saving';
    const userRegisterCreate$ = this.userRegisterService.registerUser(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Created : ', res);
        if (this.isModal) {
          super.handleSuccessfulSaveObj(res);
        }
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(userRegisterCreate$);
  }

  get f(): any {
    return this.objForm.controls;
  }
}
