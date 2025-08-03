import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class OtpService extends BaseService {
  constructor(http: HttpClient) {
    super('otps', http);
  }

  public requestOtp(): Observable<any> {
    const url = `${this.REST_API}/request-otp`;
    return this.http.get<any>(url);
  }
}
