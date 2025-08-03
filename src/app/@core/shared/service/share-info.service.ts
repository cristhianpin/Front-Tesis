import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ShareInfoService extends BaseService {
  constructor(http: HttpClient) {
    super('share-infos', http);
  }

  public shareTrn(object: any): Observable<any> {
    const url = `${this.REST_API}`;
    return this.http.post<any>(url, object);
  }
}
