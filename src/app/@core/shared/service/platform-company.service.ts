import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformCompanyService extends BaseService {
  constructor(http: HttpClient) {
    super('platform-company', http);
  }

  public findAllByCompanyId(companyId: string, slug?: string): Observable<unknown[]> {
    let urle = `${this.REST_API}/company/${companyId}/${slug}`;
    return this.http.get<unknown[]>(urle);
  }
}
