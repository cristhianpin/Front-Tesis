import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestResponse } from '../response/rest-response.model';

@Injectable({
  providedIn: 'root',
})
export class ClientDetailService extends BaseService {
  constructor(http: HttpClient) {
    super('client-detail', http);
  }

  public restore(id: string): Observable<RestResponse> {
    const url = `${this.REST_API}/restore-password/${id}`;
    return this.http.get<any>(url);
  }
}
