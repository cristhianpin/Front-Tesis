import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class RegisteredBankService extends BaseService {
  constructor(http: HttpClient) {
    super('registered-banks', http);
  }

  public findAllByEnabled(enabled: boolean): Observable<any> {
    const url = `${this.REST_API}?enabled=${enabled}`;
    return this.http.get<any>(url);
  }

  public findAllByCountry(countryCode: string): Observable<any> {
    const url = `${this.REST_API}/country/${countryCode}`;
    return this.http.get<any>(url);
  }
}
