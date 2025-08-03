import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovementService extends BaseService {
  constructor(http: HttpClient) {
    super('movement', http);
  }

  public createDeposit(object: any): Observable<any> {
    const url = `${this.REST_API}/deposit`;
    return this.http.post<any>(url, object);
  }

  public findAllByCompanyId(companyId: string): Observable<unknown[]> {
    const url = `${this.REST_API}/company/${companyId}`;
    return this.http.get<unknown[]>(url);
  }
}
