import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export class BaseService {
  protected readonly REST_API: string = environment.REST_URL;
  // protected readonly REST_AUTH_API: string = environment.REST_AUTH_URL;

  constructor(name: string, protected http: HttpClient) {
    this.REST_API = `${this.REST_API}${name}`;
  }
  public index(): Observable<unknown[]> {
    const url = `${this.REST_API}/index`;
    return this.http.get<unknown[]>(url);
  }
  public find(id: string): Observable<any> {
    const url = `${this.REST_API}/find/${id}`;
    return this.http.get<any>(url);
  }
  public delete(id: string): Observable<unknown> {
    const url = `${this.REST_API}/delete/${id}`;
    return this.http.delete<unknown>(url);
  }
  public update(object: any): Observable<any> {
    const url = `${this.REST_API}/update`;
    return this.http.put<any>(url, object);
  }
  public create(object: any): Observable<any> {
    const url = `${this.REST_API}/create`;
    return this.http.post<any>(url, object);
  }
  public findById(id: string): Observable<any> {
    const url = `${this.REST_API}/one/${id}`;
    return this.http.get<any>(url);
  }
  public findAll(onlyEnabled = false): Observable<unknown[]> {
    const url = `${this.REST_API}?onlyEnabled=${onlyEnabled}`;
    return this.http.get<unknown[]>(url);
  }

  public findAllByTrnType(trnType?: string, activo?: boolean): Observable<unknown[]> {
    let url = `${this.REST_API}`;
    if (trnType && activo) {
      url = `${this.REST_API}?trn-type=${trnType}&active=${activo}`;
    } else if (trnType) {
      url = `${this.REST_API}?trn-type=${trnType}`;
    } else if (activo) {
      url = `${this.REST_API}?activo=${activo}`;
    }
    return this.http.get<unknown[]>(url);
  }


  // public updateById(id: string, object: unknown): Observable<unknown> {
  //   const url = `${this.REST_API}/${id}`;
  //   return this.http.put<unknown>(url, object);
  // }



  // public setEnabled(id: string, object: unknown): Observable<unknown> {
  //   const url = `${this.REST_API}/set-enabled/${id}`;
  //   return this.http.put<unknown>(url, object);
  // }
}
