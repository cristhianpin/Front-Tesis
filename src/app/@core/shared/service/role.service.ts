import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService {
  constructor(http: HttpClient) {
    super('role', http);
  }
}
