import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Employees } from './employees.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Departement } from '../add-employee/entreprise.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:6200/departements';
  isTblLoading = true;
  dataChange: BehaviorSubject<Departement[]> = new BehaviorSubject<Departement[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: Departement;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Departement[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllEmployeess(): void {
    this.subs.sink = this.httpClient.get<Departement[]>(this.API_URL).subscribe({
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
  addDepartement(departement: Departement): Observable<any> {
    return this.httpClient.post(this.API_URL, departement).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gérer les erreurs lors de l'ajout d'une entreprise
        console.error('Error adding company:', error);
        return throwError(error);
      })
    );
  }
  addEmployees(employees: Departement): void {
    this.dialogData = employees;

    // this.httpClient.post(this.API_URL, employees)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = employees;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  getDepartementById(id: string): Observable<Departement> {
    return this.httpClient.get<Departement>(`${this.API_URL}/${id}`);
  }
  // updateEmployees(employees: Departement): Observable<Departement> {
  //   this.dialogData = employees;

  //   return this.httpClient.put<Departement>(this.API_URL + employees._id, employees)
  //       .subscribe({
  //         next: (data) => {
  //           this.dialogData = employees;
  //         },
  //         error: (error: HttpErrorResponse) => {
  //            // error code here
  //         },
  //       });
        
  // }
//   updateEmployees(employees: Departement): Observable<Departement> {
//     const url = `${this.API_URL}/${employees._id}`;

//     return this.httpClient.put<Departement>(url, employees).pipe(
//         tap((updatedEmployee:Departement) => {
//             this.dialogData = updatedEmployee; // Mettre à jour les données du dialogue avec les données mises à jour
//         }),
//         catchError((error: HttpErrorResponse) => {
//             // Gérer les erreurs ici
//             console.error('Error updating employee', error);
//             throw error; // Renvoyer l'erreur pour la gérer dans le composant appelant si nécessaire
//         })
//     );
// }
updateEmployees(employees: Departement): Observable<Departement> {
  const url = `${this.API_URL}/${employees._id}`;

  return this.httpClient.put<Departement>(url, employees).pipe(
      tap((updatedEmployee: Departement) => {
          console.log('Updated employee:', updatedEmployee);
          this.dialogData = updatedEmployee; // Mettre à jour les données du dialogue avec les données mises à jour
      }),
      catchError((error: HttpErrorResponse) => {
          // Gérer les erreurs ici
          console.error('Error updating employee', error);
          throw error; // Renvoyer l'erreur pour la gérer dans le composant appelant si nécessaire
      })
  );
}

  // updateEmployee(employeeData: Departement): Observable<Departement> {
  //   const url = `${this.API_URL}/${employeeData._id}`; // Assurez-vous d'adapter l'URL de l'API à votre structure

  //   return this.httpClient.put<Departement>(url, employeeData);
  // }
  deleteEmployees(id: string): void {
    console.log(id);

    this.httpClient.delete(this.API_URL + id)
        .subscribe({
          next: (data) => {
            console.log(id);
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }
}
