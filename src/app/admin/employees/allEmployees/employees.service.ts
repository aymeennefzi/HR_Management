import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employees } from './employees.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService extends UnsubscribeOnDestroyAdapter {
  
  private apiUrl = 'http://localhost:3000/auth'; // Remplacez cette URL par l'URL de votre backend

  //private readonly API_URL = 'assets/data/employees.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Employees[]> = new BehaviorSubject<Employees[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: Employees;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Employees[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllEmployeess(): void {
    this.subs.sink = this.httpClient.get<Employees[]>(this.apiUrl).subscribe({
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

  getAllUsers(): Observable<Employees[]> {
    return this.httpClient.get<Employees[]>(this.apiUrl + "/allusers"); 
  }
  

  addEmployees(employees: Employees): void {
    this.dialogData = employees;
    this.httpClient.post(this.apiUrl, employees)
      .subscribe({
        next: (data) => {
          this.dialogData = employees;
        },
        error: (error: HttpErrorResponse) => {
           // error code here
        },
      });
  }
  updateEmployees(employees: Employees): void {
    this.dialogData = employees;

    // this.httpClient.put(this.API_URL + employees.id, employees)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = employees;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteEmployees(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  getImageById(_id: string): Observable<Blob> {
    return this.httpClient.get('http://localhost:3000/auth/uplo/' + _id, { responseType: 'blob' });
  }

  getImage(imageId: string): Observable<Blob> {
    return this.httpClient.get<Blob>(`http://localhost:3000/auth/${imageId}`, { responseType: 'blob' as 'json' });
  }
  activateUser(userId: string): Observable<Employees> {
    const body = { userId }; // Créez un objet contenant l'ID de l'utilisateur
    return this.httpClient.post<Employees>(this.apiUrl + "/activate", body);
  }
  desactivatedUser(userId: string): Observable<Employees> {
    const body = { userId }; // Créez un objet contenant l'ID de l'utilisateur
    return this.httpClient.post<Employees>(this.apiUrl + "/deactivate", body);
  }
  signUp(employees: Employees): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(this.apiUrl + "/signup", employees);
  }
  getUserById(userId: string): Observable<Employees> {
    return this.httpClient.get<Employees>(this.apiUrl +"/finduser/"+ userId );
  }
  updateUser(userId: string, updateDto: Employees): Observable<Employees> {
    return this.httpClient.patch<Employees>(this.apiUrl + "/updateProfile/" + userId , updateDto);
  }
}
