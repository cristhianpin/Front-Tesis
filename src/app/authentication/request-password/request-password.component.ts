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
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss'],
})
export class RequestPaswordComponent implements OnInit, OnDestroy {
  public showLoading = false;
  public requestPasswordBtn = 'Recuperar contraseña';
  public loginBtn = 'Ir a inicio sesión';

  protected subscriptions: Subscription[] = [];

  public objForm: FormGroup;
  protected objModal: any;
  private obj: any;

  public showLogin = false;
  public showMessageSuccess: boolean = false;
  public messageSuccess: string;
  public showMessageError: boolean = false;
  public messageError: string;

  public showMessageInfo: boolean = true;
  public messageInfo: string =
    'Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña';

  public submitted: boolean = false;
  public disabledInput: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    //this.logger.debug('ngOnInit');
    this.initValues();
  }

  private initValues(): void {
    //this.logger.debug('initValues');
    this.objForm = this.createDataForm(true);
    this.objForm.patchValue({
      _email: '',
    });
  }

  private setMessageError(messageError: string): void {
    this.showMessageSuccess = false;
    this.showMessageInfo = false;
    this.showMessageError = true;
    this.showLoading = false;
    this.messageError = messageError;
  }

  private formsToModel(): void {
    this.obj = {
      email: this.objForm.controls._email.value,
    };
    //this.logger.debug('formsToModel, this.obj: ', this.obj);
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

    const requestPassword$ = this.authService.forgotPassword(this.obj.email).subscribe((res: any) => {
      if (res) {
        //this.logger.debug('requestPassword, res: ', res);
        if (res.code == 200 || res.code == 201) {
          if (res.data.messageError) {
            this.setMessageError(res.data.messageError);
          } else {
            this.showMessageError = false;
            this.showMessageInfo = false;
            this.disabledInput = true;

            this.showLoading = false;
            this.showLogin = true;
            this.showMessageSuccess = true;
            this.messageSuccess = 'Ok! Hemos enviado un enlace a su correo electrónico';
          }
        } else {
          this.setMessageError('Error interno');
        }
      } else {
        this.setMessageError('Error interno');
      }
    });
    this.subscriptions.push(requestPassword$);
  }

  get f(): any {
    return this.objForm.controls;
  }

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      _email: new FormControl(
        {
          value: create ? null : '',
        },
        [Validators.required, Validators.email],
      ),
    });
  }

  ngOnDestroy(): void {
    //this.logger.debug('ngOnDestroy');
  }

  private showFormDetailInLog(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control.invalid) {
        console.error('Field error : ', field, control.errors);
      }
    });
  }
}
