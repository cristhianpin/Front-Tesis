import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TablePreferenceService extends BaseService {
  constructor(http: HttpClient) {
    super('table-preference', http);
  }

  public findByTableName(tableName: string): Observable<any> {
    const url = `${this.REST_API}/name/${tableName}`;
    return this.http.get<any>(url);
  }
}
