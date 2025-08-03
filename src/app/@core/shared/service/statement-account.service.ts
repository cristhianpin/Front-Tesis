import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatementAccountService extends BaseService {
  constructor(http: HttpClient) {
    super('statement-account', http);
  }

  public property(): Observable<unknown[]> {
    const url = `${this.REST_API}/property`;
    return this.http.get<unknown[]>(url);
  }

  public detail(id: string): Observable<any> {
    const url = `${this.REST_API}/detail/${id}`;
    return this.http.get<any>(url);
  }

  public payment(status: string): Observable<any> {
    const url = `${this.REST_API}/payment?status=${status}`;
    return this.http.get<any>(url);
  }

  public approval(id: string): Observable<any> {
    const url = `${this.REST_API}/approval/${id}`;
    return this.http.get<any>(url);
  }

  public reject(id: any, comment: string): Observable<any> {
    const url = `${this.REST_API}/reject`;
    return this.http.put<any>(url, { comment: comment, paymentId: id });
  }
}
