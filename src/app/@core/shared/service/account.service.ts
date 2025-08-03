import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestResponse } from '../response/rest-response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseService {
  constructor(http: HttpClient) {
    super('account', http);
  }

  public findAllAdm(): Observable<unknown[]> {
    const url = `${this.REST_API}/adm`;
    return this.http.get<unknown[]>(url);
  }

  public findAllByCompanyId(companyId: string): Observable<unknown[]> {
    const url = `${this.REST_API}/company/${companyId}`;
    return this.http.get<unknown[]>(url);
  }

  public uploadFile(formData: FormData): Observable<RestResponse> {
    const url = `${this.REST_API}/import-masive-file`;
    return this.http.post<RestResponse>(url, formData);
  }
}
