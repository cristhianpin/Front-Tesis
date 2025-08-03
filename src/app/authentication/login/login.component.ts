import { Component } from '@angular/core';
import { NbAuthResult, NbLoginComponent } from '@nebular/auth';
import { RoleEnum } from '../../@core/shared/enum/role.enum';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {
  public showPassword = false;
  public showLoading = false;
  public loginBtn = 'Inicio sesión';
  public usingMFA = false;
  public messageError: string;

  public login(): void {
    this.errors = [];
    this.messages = [];

    this.submitted = true;
    this.showLoading = true;
    this.loginBtn = 'Inicio sesión';
    this.user.usingMFA = this.usingMFA;

    if (!this.usingMFA) {
      this.user.code = '';
    }

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {

      this.messageError = result.getResponse()?.error?.errorDescription;

      // getPayload
      this.submitted = false;

      const redirect = result.getRedirect();
      if (result.isSuccess()) {
        this.getPayload(result);
        this.messages = result.getMessages();
      } else {
        this.showLoading = false;
        this.errors = result.getErrors();
        this.errors.push(result.getResponse()?.error?.errorDescription);
        this.loginBtn = 'Inicio sesión';
        this.usingMFA = false;
        if (
          this.errors &&
          this.errors.length &&
          this.errors.length > 1 &&
          ('mfa.error.required' === this.errors[1] || 'mfa.error.invalid' === this.errors[1])
        ) {
          this.usingMFA = true;
          if ('mfa.error.required' === this.errors[1]) {
            this.errors = [];
          }
        }
      }

      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  public getInputType(): string {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  public toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  private getPayload(result: NbAuthResult): void {
    const token = result.getToken();
    const metadata = token.getPayload();
    localStorage.setItem('cId', metadata.id);
    localStorage.setItem('cId', metadata.id);
    localStorage.setItem('role', metadata.role); // guarda el rol por si lo necesitas luego
    console.log('metadata', metadata);
    // Redirección dinámica según el rol
    switch (metadata.scopes[0] ?? 'NA') {
      case RoleEnum.ADMINISTRADOR:
        this.router.navigate(['/pages/dashboard/view']);
        break;
      case RoleEnum.ESTUDIANTE:
        this.router.navigate(['/pages/registration/view']);
        break;
      case RoleEnum.ROOT:
        this.router.navigate(['/pages/dashboard/view']);
        break;
      default:
        this.router.navigate(['/authentication/sign-in']);
        break;
    }
  }
}
