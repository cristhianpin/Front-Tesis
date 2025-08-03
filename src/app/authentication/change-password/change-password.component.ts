import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { NbAuthResult, NbLoginComponent, deepExtend } from '@nebular/auth';
import { BaseComponent } from '../../@core/shared/component/base.component';
import { NbDialogRef } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../@core/shared/component/base-form.component';
import { UserService } from '../../@core/shared/service/user.service';
import { AuthService } from '../../@core/shared/service/auth.service';
import { isUUID } from '../../@core/utils/helpers';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public showPassword1 = false;
  public showPassword2 = false;

  public showLoading = false;
  public showLogin = false;
  public confirmBtn = 'cambiar contraseña';
  public newTokenBtn = 'Solicitar nueva solicitud';
  public loginBtn = 'Ir a inicio sesión';

  private userId: string;
  private tokenConfirm: string;

  public objForm: FormGroup;
  protected objModal: any;
  private obj: any;

  public showNewPassword: boolean = false;
  public showMessageSuccess: boolean = true;
  public messageSuccess: string;
  public showMessageError: boolean = true;
  public messageError: string;

  public showNewToken: boolean = false;

  public submitted: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    //this.logger.debug('ngOnInit');

    // this.printInputVals();
    this.initValues();

    // this.activatedRoute.params.subscribe((params) => {
    //   this.token = params['objId'] ? params['objId'] : this.objIdModal;
    // });
  }

  private initValues(): void {
    //this.logger.debug('initValues');

    this.showNewToken = false;
    this.objForm = this.createDataForm();

    this.objForm.patchValue({
      pass1: '',
    });
    this.objForm.patchValue({
      pass2: '',
    });

    this.showLoading = true;

    // get data url
    this.activatedRoute.params.subscribe((params) => {
      //this.logger.debug('reset-password, params: ', params);
      this.userId = params['us'];
      this.tokenConfirm = params['tk'];
    });

    if (!this.userId || !this.tokenConfirm) {
      this.showLogin = true;
      this.setMessageError('Datos recibidos inválidos');
      return;
    }

    if (!isUUID(this.userId)) {
      this.showLogin = true;
      this.setMessageError('Datos recibidos inválidos');
      return;
    }

    // validate params
    this.authService.confirmResetPassword(this.userId, this.tokenConfirm).subscribe((res: any) => {
      if (res) {
        //this.logger.debug('confirmResetPassword, res: ', res);
        if (res.code == 200 || res.code == 201) {
          if (res.data.messageError) {
            if (res.data.codeError == 'E003' || res.data.codeError == 'E004') {
              this.showLogin = false;
              this.showNewToken = true;
            }
            this.setMessageError(res.data.messageError);
          } else {
            this.showLoading = false;
            this.showMessageError = false;
            this.showMessageSuccess = true;
            this.messageSuccess = 'Ok! Se ha confirmado su acceso';
            this.showNewPassword = true;
            this.showLogin = false;
          }
        } else {
          this.showLogin = true;
          this.setMessageError('Error interno');
        }
      } else {
        this.showLogin = true;
        this.setMessageError('Error interno');
      }
    });

    // //this.logger.debug('confirm-account, userId:', this.userId);
    // //this.logger.debug('confirm-account, token:', this.tokenConfirm);
  }

  private setMessageError(messageError: string): void {
    this.showMessageSuccess = false;
    this.showMessageError = true;
    this.showLoading = false;
    this.messageError = messageError;
  }

  private formsToModel(): void {
    this.obj = {
      pass1: this.objForm.controls.pass1.value,
      pass2: this.objForm.controls.pass2.value,
      userId: this.userId,
      token: this.tokenConfirm,
    };
    //this.logger.debug('formsToModel, this.obj: ', this.obj);
  }

  get f(): any {
    return this.objForm.controls;
  }

  private formsToModelNewToken(): void {
    this.obj = {
      userId: this.userId,
      token: this.tokenConfirm,
    };
    //this.logger.debug('formsToModelNewToken, this.obj: ', this.obj);
  }

  public onSubmitNewToken(): void {
    this.formsToModelNewToken();

    //this.logger.debug('onSubmitNewToken, obj: ', this.obj);

    this.showLoading = true;

    const newTokenResetPassword$ = this.authService.newTokenResetPassword(this.obj).subscribe((res: any) => {
      if (res) {
        //this.logger.debug('newTokenResetPassword, res: ', res);
        if (res.code == 200 || res.code == 201) {
          if (res.data.messageError) {
            this.showLogin = true;

            this.setMessageError(res.data.messageError);
          } else {
            this.showLoading = false;
            this.showLogin = true;
            this.showMessageError = false;
            this.showMessageSuccess = true;
            this.messageSuccess = 'Éxito! Hemos enviado una nueva solicitud a su correo electrónico';
          }
        } else {
          this.showLogin = true;
          this.setMessageError('Error interno');
        }
      } else {
        this.showLogin = true;
        this.setMessageError('Error interno');
      }
    });
  }

  private createDataForm(): FormGroup {
    return new FormGroup({
      pass1: new FormControl(
        {
          value: null,
        },
        [Validators.required, Validators.minLength(8)],
      ),
      pass2: new FormControl(
        {
          value: null,
        },
        [Validators.required, Validators.minLength(8)],
      ),
    });
  }

  ngOnDestroy(): void {
    //this.logger.debug('ngOnDestroy');
  }

  public toggleShowPass1(): void {
    this.showPassword1 = !this.showPassword1;
  }

  public toggleShowPass2(): void {
    this.showPassword2 = !this.showPassword2;
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

  private showFormDetailInLog(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control.invalid) {
        console.error('Field error : ', field, control.errors);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    //this.logger.debug('Data Form status : ', this.objForm.status);

    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }

    this.formsToModel();
    this.updateObj();
  }

  private updateObj(): void {
    //this.logger.debug(`will create : `, this.obj);
    this.showLoading = true;

    const requestPassword$ = this.authService.changePassword(this.obj).subscribe((res: any) => {
      if (res) {
        //this.logger.debug('requestPassword, res: ', res);
        if (res.code == 200 || res.code == 201) {
          if (res.data.messageError) {
            this.showLogin = false;
            this.setMessageError(res.data.messageError);
          } else {
            this.showMessageError = false;
            this.showLoading = false;
            this.showLogin = true;
            this.showMessageSuccess = true;
            this.showNewPassword = false;
            this.messageSuccess = 'Éxito! Hemos actualizado tu contraseña correctamente';
          }
        } else {
          this.setMessageError('Error interno');
        }
      } else {
        this.setMessageError('Error interno');
      }
    });
  }
}
