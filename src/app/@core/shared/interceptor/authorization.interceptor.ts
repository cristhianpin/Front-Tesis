import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.authService.isAuthenticated().pipe(
          tap((authenticated) => {
            if (authenticated) {
              // console.error('ErrorInterceptor : ', err);
              if (401 === err.status) {
                // console.error('Auto logout : 401 Unauthorized');
                this.authService.logout('email');
                this.router.navigate(['authentication/sign-in']);
              } else if (403 === err.status) {
                // console.error('Auto logout : 403 Forbidden response returned from api');
                this.authService.logout('email');
                location.reload();
              }
              // let error = err.error || err.statusText;
              // if (415 === err.status) {
              //     error = err.statusText;
              // } else if (200 === err.status) {
              //     error = err.error.error.message;
              // }
              // console.error(error);
              return next.handle(request);
            }
            // console.error('not authenticated');
            return next.handle(request);
          }),
        );
        return next.handle(request);
      }),
    );
  }
}
