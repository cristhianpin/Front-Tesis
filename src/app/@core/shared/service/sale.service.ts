import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService extends BaseService {
  constructor(http: HttpClient) {
    super('sale', http);
  }

  public createSale(object: any): Observable<any> {
    const url = `${this.REST_API}`;
    return this.http.post<any>(url, object);
  }

  public findAllAdm(): Observable<unknown[]> {
    const url = `${this.REST_API}/adm`;
    return this.http.get<unknown[]>(url);
  }

  public findAllByCompanyId(companyId: string): Observable<unknown[]> {
    const url = `${this.REST_API}/company/${companyId}`;
    return this.http.get<unknown[]>(url);
  }
}
