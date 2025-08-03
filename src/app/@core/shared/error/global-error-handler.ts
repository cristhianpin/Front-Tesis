import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { AlertService } from '../service/alert.service';
import { ErrorService } from '../service/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private router: Router) {}

  handleError(error: Error | HttpErrorResponse): void {
    console.error(error);
    const errorService = this.injector.get(ErrorService);
    const alertService = this.injector.get(AlertService);
    const authService = this.injector.get(NbAuthService);
    let message: string;
    // let stackTrace: any;

    if (error instanceof HttpErrorResponse) {
      // Server API error
      message = errorService.getServerErrorMessage(error);
    } else {
      // Client Error
      message = errorService.getClientErrorMessage(error);
      // if (message === 'this.config is undefined') {
      //   return;
      // }
      return;
      // if (message !== 'error.no-internet-connection') {
      //   return;
      // }
    }

    if (error.status === 401) {
      authService.logout('email');
      this.router.navigate(['authentication/sign-in']);
    }
    alertService.showError(message);
  }
}
