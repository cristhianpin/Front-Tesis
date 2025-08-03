import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformPlanService extends BaseService {
  constructor(http: HttpClient) {
    super('platform-plan', http);
  }

  public findAllByPlatformId(platformId: string): Observable<unknown[]> {
    let urle = `${this.REST_API}/platform/${platformId}`;
    return this.http.get<unknown[]>(urle);
  }
}
