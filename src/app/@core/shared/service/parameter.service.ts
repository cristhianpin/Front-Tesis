import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ParameterService extends BaseService {
  constructor(http: HttpClient) {
    super('parameters', http);
  }

  public findAllByCompanies(company: string): Observable<any> {
    let url = `${this.REST_API}`;
    url = `${this.REST_API}/company/${company}`;
    return this.http.get<any>(url);
  }

  public findByNameAndCompany(name: string, company: string): Observable<unknown> {
    let url = `${this.REST_API}`;
    url = `${this.REST_API}/name/${name}/company/${company}`;
    return this.http.get<unknown>(url);
  }
}
