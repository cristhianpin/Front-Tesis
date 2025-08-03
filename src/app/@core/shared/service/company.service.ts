import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends BaseService {
  constructor(http: HttpClient) {
    super('company', http);
  }

  public getBalance(): Observable<any> {
    const url = `${this.REST_API}/c/balance`;
    return this.http.get<any>(url);
  }

  public verifyBalance(object: any): Observable<any> {
    const url = `${this.REST_API}/verify`;
    return this.http.post<any>(url, object);
  }

  public findAllAdm(): Observable<unknown[]> {
    const url = `${this.REST_API}/adm`;
    return this.http.get<unknown[]>(url);
  }
}
