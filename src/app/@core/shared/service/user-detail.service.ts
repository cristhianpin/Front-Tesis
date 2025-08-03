import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDetailService extends BaseService {
  constructor(http: HttpClient) {
    super('user-detail', http);
  }

  public getStudents(): Observable<unknown[]> {
    const url = `${this.REST_API}/student`;
    return this.http.get<unknown[]>(url);
  }
}
