import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/user.model';
import { RestResponse } from '../response/rest-response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(http: HttpClient) {
    super('auth', http);
  }

  public findAuth(): Observable<RestResponse> {
    const url = `${this.REST_API}/user`;
    return this.http.get<RestResponse>(url);
  }

  public createSign(object: any): Observable<any> {
    const url = `${this.REST_API}/sing-create`;
    return this.http.post<any>(url, object);
  }

  public confirmUser(userId: string, token: string): Observable<RestResponse> {
    const url = `${this.REST_API}/confirm-user/${userId}/${token}`;
    return this.http.post<any>(url, null);
  }

  public confirmResetPassword(userId: string, token: string): Observable<RestResponse> {
    const url = `${this.REST_API}/confirm-user-reset-password/${userId}/${token}`;
    return this.http.post<any>(url, null);
  }

  public forgotPassword(email: string): Observable<RestResponse> {
    const url = `${this.REST_API}/forgot-password/${email}`;
    return this.http.put<any>(url, null);
  }

  public changePassword(object: any): Observable<RestResponse> {
    const { userId, token, pass1, pass2 } = object;
    const url = `${this.REST_API}/change-password/${userId}/${token}/${pass1}/${pass2}`;
    return this.http.put<any>(url, null);
  }

  public newToken(object: any): Observable<RestResponse> {
    const { userId, token } = object;
    const url = `${this.REST_API}/new-token-confirmed/${userId}/${token}`;
    return this.http.put<any>(url, null);
  }

  public newTokenResetPassword(object: any): Observable<RestResponse> {
    const { userId, token } = object;
    const url = `${this.REST_API}/new-token-reset-password/${userId}/${token}`;
    return this.http.put<any>(url, null);
  }
}
