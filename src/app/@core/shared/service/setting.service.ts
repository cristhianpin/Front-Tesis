import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService extends BaseService {
  constructor(http: HttpClient) {
    super('setting', http);
  }

  public save(object: any): Observable<any> {
    const url = `${this.REST_API}/save`;
    return this.http.post<any>(url, object);
  }
}
