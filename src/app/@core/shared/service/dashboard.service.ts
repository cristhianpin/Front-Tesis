import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  constructor(http: HttpClient) {
    super('dashboard', http);
  }

  public findIndex(params: { period?: string } = {}): Observable<any> {
    const url = `${this.REST_API}/index-dashboard`;
    return this.http.get(url, { params });
  }
}
