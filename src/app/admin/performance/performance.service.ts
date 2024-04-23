import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Performance } from './performance';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  dataChange: BehaviorSubject<Performance[]> = new BehaviorSubject<Performance[]>(
    []
  );
  private apiUrl = 'http://localhost:3000/performance'; // Adjust the URL based on your environment
  data: any;

  constructor(private http: HttpClient) {}

  createPerformance(): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-performance`, {});
  }

  updateScore(userId: string, performanceId: string, score: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/${performanceId}/score`, { score });
  }

  getPerformances(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
