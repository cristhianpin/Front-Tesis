import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MfaService extends BaseService {
  constructor(http: HttpClient) {
    super('mfa', http);
  }

  public requestQR(): Observable<any> {
    const url = `${this.REST_API}`;
    return this.http.get<string>(url);
  }

  public setMFA(code: string, activate: boolean): Observable<any> {
    const url = `${this.REST_API}?code=${code}&activate=${activate}`;
    return this.http.put<any>(url, null);
  }

  // public verifyMFA(totp: string, userId: string): Observable<any> {
  //   const url = `${this.REST_AUTH_API}jwt/verify-totp?totp=${totp}&userId=${userId}`;
  //   return this.http.post<any>(url, null);
  // }
}
