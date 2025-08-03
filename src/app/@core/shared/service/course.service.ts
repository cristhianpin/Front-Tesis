import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService extends BaseService {
  constructor(http: HttpClient) {
    super('course', http);
  }

  public planIndex(courseId: string): Observable<any> {
    const url = `${this.REST_API}/plan/index?courseId=${courseId}`;
    return this.http.get<any>(url);
  }

  public deletePlan(courseId: string): Observable<any> {
    const url = `${this.REST_API}/plan/delete?planId=${courseId}`;
    return this.http.get<any>(url);
  }
  public updatePlan(object: any): Observable<any> {
    const url = `${this.REST_API}/plan/update`;
    return this.http.put<any>(url, object);
  }
  public createPlan(object: any): Observable<any> {
    const url = `${this.REST_API}/plan/create`;
    return this.http.post<any>(url, object);
  }

  public recommendedCourses(payload: { interests: string[] }): Observable<any> {
    const url = `${this.REST_API}/registration/recommended`;
    return this.http.post<any>(url, payload);
  }

  public getAllActiveCourses(): Observable<any> {
    const url = `${this.REST_API}/registration/courses`;
    return this.http.get<any>(url);
  }

  public saveRegistration(payload: any): Observable<any> {
    const url = `${this.REST_API}/registration/save`;
    return this.http.post<any>(url, payload);
  }

  public getMyCourses(): Observable<any> {
    const url = `${this.REST_API}/registration/my-courses`;
    return this.http.get<any>(url);
  }


  public cancelEnrollment(item){
    const url = `${this.REST_API}/registration/cancel`;
    return this.http.post<any>(url, { enrollment_id: item });
  }
}
