import { Injectable } from '@angular/core';
import { Poste } from './Poste.model';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PosteService extends UnsubscribeOnDestroyAdapter {
  baseUrl = 'http://localhost:3000/post';
 isTblLoading = true;
 dataChange: BehaviorSubject<Poste[]> = new BehaviorSubject<
   Poste[]
 >([]);
 // Temporarily stores data from dialogs
 dialogData!: Poste;
 constructor(private httpClient: HttpClient) {
   super();
 }
 get data(): Poste[] {
   return this.dataChange.value;
 }
 getDialogData() {
   return this.dialogData;
 }
 /** CRUD METHODS */
 getAllPoste(): any {
   this.subs.sink = this.httpClient
     .get<Poste[]>('http://localhost:3000/post')
     .subscribe({
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
 // getAllPayrollsWithUsersAndPoste(): Observable<any[]> {
 //   return this.httpClient.get<any[]>('http://localhost:3000/payroll/withUsersAndPoste').pipe(
 //     tap(payroll => console.log('payroll', payroll))
 //   );
 // }
 
 getUsersWithoutPoste(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.baseUrl}/no-post`);
}
 createPost(createPostDto: Poste): Observable<Poste> {
  return this.httpClient.post<Poste>(`${this.baseUrl}/AddP`, createPostDto);
}
assignUserToPost(userIds: string[], postId: string) {
  // Méthode pour affecter un utilisateur à un poste
  return this.httpClient.post<void>(`${this.baseUrl}/postAssign`, { userIds, postId });
}
 
 
// createPost(Poste: Poste): void {
//    this.dialogData = Poste;

//    this.httpClient.post(`${this.baseUrl}/AddP`, Poste)
//      .subscribe({
//        next: (data) => {
//          this.dialogData = Poste;
//        },
//        error: (error: HttpErrorResponse) => {
//           // error code here
//        },
//      });
//  }





 getPosteById(id: string): Observable<Poste> {
  return this.httpClient.get<Poste>(`${this.baseUrl}/${id}`);
}

updatePoste(id: string, postData: Poste): Observable<Poste> {
  return this.httpClient.put<Poste>(`${this.baseUrl}/update/${id}`, postData);
}
 updateEmployeeSalary(Poste: Poste): void {
   this.dialogData = Poste;

   // this.httpClient.put(this.API_URL + employeeSalary.id, employeeSalary)
   //     .subscribe({
   //       next: (data) => {
   //         this.dialogData = employeeSalary;
   //       },
   //       error: (error: HttpErrorResponse) => {
   //          // error code here
   //       },
   //     });
 }

 deletePoste(posteId: string): Observable<void> {
  const url = `${this.baseUrl}/deletePoste/${posteId}`;

  return this.httpClient.delete<void>(url)
    .pipe(
      catchError(this.handleError) // Gérer les erreurs
    );
}

// Gestionnaire d'erreurs générique
private handleError(error: any) {
  console.error('Erreur API:', error);
  return throwError('Erreur serveur, veuillez réessayer plus tard.');
}

getPosteBySalaryRange(minSalary: number, maxSalary: number): Observable<Poste[]> {
  const url = `${this.baseUrl}/${minSalary}/${maxSalary}`;
  return this.httpClient.get<Poste[]>(url);
}

getPosteByPostName(postName: string): Observable<Poste> {
  const url = `${this.baseUrl}/${postName}`;
  return this.httpClient.get<Poste>(url);
}
 deleteEmployeeSalary(id: number): void {
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
}
