import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Injectable()
export class LoggerAuthorizationService {
  constructor(private authService: NbAuthService) {}

  protected alterHttpRequest(httpRequest: HttpRequest<any>): HttpRequest<any> {
    // Alter httpRequest by adding auth token to header
    let _token: string;
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      _token = token.getValue();
      httpRequest = httpRequest.clone({
        setHeaders: {
          ['Authorization']: `Bearer ${token.getValue()}`,
        },
      });
      return httpRequest;
    });

    return httpRequest;
  }
}
