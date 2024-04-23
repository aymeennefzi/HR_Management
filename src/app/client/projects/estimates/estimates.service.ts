import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TasksModel } from '../all-projects/core/project.model';

@Injectable({
  providedIn: 'root',
})
export class EstimatesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/estimates.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<TasksModel[]> = new BehaviorSubject<TasksModel[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: TasksModel;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): TasksModel[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllEstimatess(): void {
    this.subs.sink = this.httpClient.get<TasksModel[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }


  private apiUrl = 'http://localhost:3000'; 
  createTask(createTaskDto: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/task`, createTaskDto);
  }

  getTasks(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/task`);
  }

  getTaskById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/task/${id}`);
  }

  updateTask(id: string, taskDto: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiUrl}/task/${id}`, taskDto);
  }

  deleteTask(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/task/${id}`);
  }

  createTask2(createTaskDto: TasksModel): Observable<TasksModel> {
    return this.httpClient.post<TasksModel>(`${this.apiUrl}/task/post`, createTaskDto);
  }
}
