import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// import { PROJECTS } from "./project.data";
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends UnsubscribeOnDestroyAdapter {
  private baseUrl = 'http://localhost:3000/project'; 
  private trash: Set<number> = new Set([]); // trashed projects' id; set is better for unique ids
  // private _projects: BehaviorSubject<object[]> = new BehaviorSubject([]);
  private _projects = new BehaviorSubject<object[]>([]);
  public readonly projects: Observable<object[]> =
    this._projects.asObservable();
  private readonly API_URL = 'assets/data/projects.json';

  constructor( private httpClient: HttpClient) {
    super();
    // this._projects.next(PROJECTS); // mock up backend with fake data (not Project objects yet!)
    this.getProjects();
  }

  /** CRUD METHODS */












  createProject(project: any): Observable<any> {
    return this. httpClient.post(`${this.baseUrl}`, project);
  }

  getProjects(): Observable<any[]> {
    return this. httpClient.get<any[]>(`${this.baseUrl}`);
  }

  getProjectById(id: string): Observable<any> {
    return this. httpClient.get(`${this.baseUrl}/${id}`);
  }

  updateProject(id: string, project: any): Observable<any> {
    return this. httpClient.patch(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this. httpClient.delete(`${this.baseUrl}/${id}`);
  }
  
  getProjectsByTaskIds(taskIds: string[]): Observable<any[]> {
    const url = `${this.baseUrl}/by-tasks/jj`;
    const body = { taskIds }; // Corps de la requête avec les taskIds

    return this.httpClient.post<any[]>(url, body);
  }
  

}
