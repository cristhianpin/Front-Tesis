import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { UserService } from '../../../@core/shared/service/user.service';

@Component({
  selector: 'ngx-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
})
export class ChangePasswordFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoading = false;
  public showPassword1 = false;
  public showPassword2 = false;
  public showCurrentPassword = false;
  public noSimilar = false;
  public strongPassword = false;
  public objChange: any = {};

  constructor(activeDialog: NbDialogRef<any>, private userService: UserService) {
    super(activeDialog);
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
    this.objForm = this.createForm();
  }

  private createForm(): FormGroup {
    return new FormGroup({
      password: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.minLength(8), Validators.required],
      ),
      replyPassword: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.minLength(8), Validators.required],
      ),
      currentPassword: new FormControl(
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ),
    });
  }

  public isSimilarPassword(evt) {
    if (this.f.password.value == evt.target.value) {
      this.noSimilar = false;
    } else {
      this.noSimilar = true;
    }
  }

  public onPasswordStrengthChanged(event: boolean): void {
    this.strongPassword = event;
  }

  public onSubmit(): void {
    this.submitted = true;
    this.logger.debug('Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }
    this.changePassword();
  }

  private changePassword(): void {
    this.logger.debug(`changePassword`);
    //const formData: FormData = new FormData();
    // formData.append('id', '' + this.loggedInUser.id);
    // formData.append('currentPassword', this.f.currentPassword.value);
    // formData.append('password1', this.f.password.value);
    // formData.append('password2', this.f.replyPassword.value);

    this.objChange.id = '' + this.loggedInUser.id;
    this.objChange.currentPassword = this.f.currentPassword.value;
    this.objChange.password1 = this.f.password.value;
    this.objChange.password2 = this.f.replyPassword.value;

    this.logger.debug(`changePassword, objChange : `, this.objChange);

    const changePassword$ = this.userService.changePassword(this.objChange).subscribe({
      next: (res) => {
        this.logger.debug('Changed password : ', res);
        super.handleSuccessfulEditObj(res);
        super.showToast('success', 'message.title.success', 'message.body.update-success');
      },
      error: (err) => {
        this.logger.error('Error al cambiar la contraseña: ', err);
        const msg = err?.error?.errorDescription || 'Error al cambiar la contraseña.';
        super.showToast('danger', 'Error', msg);
      },
    });
    this.subscriptions.push(changePassword$);
  }

  public getInputType(): string {
    if (this.showCurrentPassword) {
      return 'text';
    }
    return 'password';
  }

  public getInputTypePass1(): string {
    if (this.showPassword1) {
      return 'text';
    }
    return 'password';
  }

  public getInputTypePass2(): string {
    if (this.showPassword2) {
      return 'text';
    }
    return 'password';
  }

  public toggleShowPassword1(): void {
    this.showPassword1 = !this.showPassword1;
  }

  public toggleShowPassword2(): void {
    this.showPassword2 = !this.showPassword2;
  }

  public toggleShowCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
}
