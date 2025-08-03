import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestResponse } from '../response/rest-response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class EnumService extends BaseService {
  constructor(http: HttpClient) {
    super('enums', http);
  }

  public listCompanyType(): Observable<RestResponse> {
    const url = `${this.REST_API}/company-types`;
    return this.http.get<RestResponse>(url);
  }

  public listStatus(): Observable<RestResponse> {
    const url = `${this.REST_API}/trn-statuses`;
    return this.http.get<RestResponse>(url);
  }

  public listRole(): Observable<string[]> {
    const url = `${this.REST_API}/roles`;
    return this.http.get<string[]>(url);
  }

  public listProducts(): Observable<RestResponse> {
    const url = `${this.REST_API}/products`;
    return this.http.get<RestResponse>(url);
  }

  public listNotificationChannel(): Observable<RestResponse> {
    const url = `${this.REST_API}/notification-channels`;
    return this.http.get<RestResponse>(url);
  }

  public listNotificationType(): Observable<RestResponse> {
    const url = `${this.REST_API}/notification-type`;
    return this.http.get<RestResponse>(url);
  }

  public listBeneficiariesType(): Observable<RestResponse> {
    const url = `${this.REST_API}/beneficiary-type`;
    return this.http.get<RestResponse>(url);
  }

  public listLocalizations(): Observable<RestResponse> {
    const url = `${this.REST_API}/localizations`;
    return this.http.get<RestResponse>(url);
  }

  public listDispatchesType(): Observable<RestResponse> {
    const url = `${this.REST_API}/dispatch-type`;
    return this.http.get<RestResponse>(url);
  }
}
