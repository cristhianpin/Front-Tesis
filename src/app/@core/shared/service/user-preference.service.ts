import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserPreferenceService extends BaseService {
  constructor(http: HttpClient) {
    super('user-preferences', http);
  }

  public findByUser(): Observable<unknown> {
    const url = `${this.REST_API}/find-by-user`;
    return this.http.get<unknown>(url);
  }
}
