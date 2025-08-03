import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends BaseService {
  // data$ = new BehaviorSubject<any>(null);

  constructor(http: HttpClient) {
    super('reports', http);
  }

  public findAllReport(): Observable<any> {
    const url = `${this.REST_API}`;
    return this.http.get<any>(url);
  }

  public findAllParameterReport(pId: number): Observable<any> {
    const url = `${this.REST_API}/parameter-report/?pId=${pId}`;
    return this.http.get<any>(url);
  }

  public htmlReport(body: any): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Accept', `text/html`);
    const url = `${this.REST_API}/html-report/`;
    return this.http.post<any>(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'text/html',
      }),
      responseType: 'json',
    });
  }

  public generateReport(body: any, filename: string): Observable<any> {
    const download = true;
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Accept', `application/octet-stream`);
    const responseType = 'blob';
    const url = `${this.REST_API}/generate-report/`;
    return (
      this.http
        .post(url, body, { headers: httpHeaders, responseType: 'blob' })

        // post<any>(url, body, { headers: httpHeaders, responseType: responseType })
        .pipe(
          map((report) => {
            const a = document.createElement('a');
            document.body.appendChild(a);
            const blob = new Blob([report], { type: 'octet/stream' });
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            if (download) {
              a.click();
            }
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return url;
          }),
        )
    );
  }
}
