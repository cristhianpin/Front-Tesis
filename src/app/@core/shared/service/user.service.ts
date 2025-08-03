import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../model/user.model';
import { RestResponse } from '../response/rest-response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(http: HttpClient) {
    super('user', http);
  }

  public findByUsername(username: string): Observable<RestResponse> {
    const url = `${this.REST_API}/find-by-username/${username}`;
    return this.http.get<RestResponse>(url);
  }

  public findAllByCompany(companyId: string, sortBy?: string, enabled?: boolean): Observable<IUser[]> {
    let url = `${this.REST_API}?company_id=${companyId}`;
    if (sortBy) {
      url = `${url}&sort_by=${sortBy}`;
    }
    if (enabled) {
      url = `${url}&enabled=${enabled}`;
    }
    return this.http.get<IUser[]>(url);
  }

  public changePassword(object: unknown): Observable<RestResponse> {
    const url = `${this.REST_API}/reset-password`;
    return this.http.put<RestResponse>(url, object);
  }

  public confirmUser(userId: string, token?: string): Observable<RestResponse> {
    const url = `${this.REST_API}/confirm-user/${userId}/${token}`;
    return this.http.post<any>(url, null);
  }

  public registerUser(object: unknown): Observable<RestResponse> {
    const url = `${this.REST_API}/signup`;
    return this.http.post<any>(url, object);
  }
}
