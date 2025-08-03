import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { MfaService } from '../../../@core/shared/service/mfa.service';

@Component({
  selector: 'ngx-mfa-form',
  templateUrl: './mfa-form.component.html',
  styleUrls: ['./mfa-form.component.scss'],
})
export class MfaFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() usingMFA = false;

  public title = 'mfa.title-mfa';

  public urlQRCode: string;
  public secretCode: string;
  public isQRGenerated: boolean;

  public codeError = false;
  public codeErrorMsg = '';
  public showRecoveryCodes: boolean;
  public recoveryCodes: any = {};

  public codeLength = 6;

  constructor(activeDialog: NbDialogRef<any>, private mfaService: MfaService) {
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
    this.urlQRCode = '';
    this.secretCode = '';
    this.isQRGenerated = false;
    this.showRecoveryCodes = false;
    this.objForm = this.createForm();
    if (!this.usingMFA) {
      this.initQRCode();
    }
  }

  private initQRCode(): void {
    this.logger.debug('initQRCode');
    this.showSpinner = true;
    const getSecretMFA$ = this.mfaService.requestQR().subscribe((res) => {
      if (res) {
        this.secretCode = res.secretCode;
        this.urlQRCode = this.urlQRCode.concat(
          'otpauth://totp/',
          res.company,
          ':',
          res.email,
          '?secret=',
          this.secretCode,
          '&issuer=',
          res.company,
        );
        this.isQRGenerated = true;
      }
      this.showSpinner = false;
    });
    this.subscriptions.push(getSecretMFA$);
  }

  private createForm(): FormGroup {
    return new FormGroup({
      code: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.minLength(this.codeLength),
        Validators.maxLength(this.codeLength),
        Validators.pattern('[0-9]*'),
      ]),
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.logger.debug('Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }
    this.setMFA();
  }

  private setMFA(): void {
    this.logger.debug(`setMFA`);
    const setMfa$ = this.mfaService.setMFA(this.f.code.value, !this.usingMFA).subscribe(
      (res) => {
        if (res) {
          this.title = 'mfa.title-recovery';
          this.codeError = false;
          this.codeErrorMsg = '';
          if (res.enabled) {
            this.showRecoveryCodes = true;
            this.recoveryCodes = res.recoveryCodes;
          } else {
            this.closeMFA();
          }
        }
      },
      (err) => {
        this.logger.error(err);
        this.codeError = true;
        this.codeErrorMsg = err.error.key;
      },
    );
    this.subscriptions.push(setMfa$);
  }

  public closeMFA(): void {
    super.close();
  }

  public handleCodeFillEvent(value: string): void {
    this.logger.debug('handleCodeFillEvent');
    this.objForm.patchValue({
      code: value,
    });
  }
}
