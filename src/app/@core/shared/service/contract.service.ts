import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContractService extends BaseService {
  constructor(http: HttpClient) {
    super('contract', http);
  }

  public cancelEnrollment(item){
    const url = `${this.REST_API}/registration/cancel`;
    return this.http.post<any>(url, { enrollment_id: item });
  }

  public updateContract(item){
    const url = `${this.REST_API}/registration/contract`;
    return this.http.post<any>(url, item);
  }
}
