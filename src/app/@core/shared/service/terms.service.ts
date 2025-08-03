import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class TermsService extends BaseService {
  constructor(http: HttpClient) {
    super('terms', http);
  }

  public findByEnabled(): Observable<unknown> {
    const url = `${this.REST_API}/find-enabled`;
    return this.http.get<unknown>(url);
  }
}
