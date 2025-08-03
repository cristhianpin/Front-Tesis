import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestResponse } from '../response/rest-response.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AttachedFileService extends BaseService {
  constructor(http: HttpClient) {
    super('attached-files', http);
  }

  public findAllByTrn(trnId: string, asc: boolean): Observable<any> {
    const url = `${this.REST_API}?olId=${trnId}&asc=${asc}`;
    return this.http.get<any>(url);
  }

  public findAllByTrnAndProduct(trnId: string, product: string): Observable<any> {
    const url = `${this.REST_API}/trn?trnId=${trnId}&product=${product}`;
    return this.http.get<any>(url);
  }

  public uploadFile(trnId: number, product: string, data: any[]): Observable<RestResponse> {
    const url = `${this.REST_API}/upload`;
    const formData: FormData = new FormData();
    formData.append('trnId', '' + trnId);
    formData.append('product', product);

    data.forEach((file: any) => {
      formData.append('files', file, file.name + ';' + file.attachmentTypeCode);
    });

    return this.http.post<RestResponse>(url, formData);
  }

  public downloadFileById(trnId: number): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    const url = `${this.REST_API}/download?trnId=${trnId}`;
    return this.http.get<any>(url, httpOptions);
  }

  public downloadFile(trnId: number, trnType: string): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
    };
    const url = `${this.REST_API}/download?trnId=${trnId}&product=${trnType}`;
    return this.http.get<any>(url, httpOptions);
  }

  public deleteFile(id: number): Observable<RestResponse> {
    const url = `${this.REST_API}/${id}`;
    return this.http.delete<RestResponse>(url);
  }

  public reOrderFiles(trnId: string, dragIndex: number, dropIndex: number): Observable<any> {
    const url = `${this.REST_API}/${trnId}/sort/${dragIndex}/${dropIndex}`;
    return this.http.get<any>(url);
  }
}
