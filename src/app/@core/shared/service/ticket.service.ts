import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService extends BaseService {
  constructor(http: HttpClient) {
    super('ticket', http);
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
