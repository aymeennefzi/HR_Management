import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Report } from './leads.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LeadsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:5000/get-all-reports';
  isTblLoading = true;
  private authToken!: string; // Déclarez une variable pour stocker le token d'authentification

  dataChange: BehaviorSubject<Report[]> = new BehaviorSubject<Report[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Report;
  constructor(private httpClient: HttpClient,private cookieService: CookieService) {
    super();
  }
  get data(): Report[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllReports(): void{
    const authToken = this.retrieveUserData();

    // Créer les en-têtes HTTP avec le jeton d'authentification
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    this.httpClient.get<Report[]>(this.API_URL, { headers: headers }).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        console.log('Data received:', data); // Ajout du console log pour afficher les données reçues
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.error('Error:', error.name, error.message); // Ajout du console log pour afficher l'erreur
      },
    });
  }
  downloadReport(filename: string): Observable<Blob> {
    const authToken = this.retrieveUserData();
    
    // Créer les en-têtes HTTP avec le jeton d'authentification
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });

    // Envoyer la requête HTTP avec les en-têtes personnalisés
    return this.httpClient.get(`http://localhost:5000/download-report?filename=${filename}`, { headers: headers, responseType: 'blob' });
  }
  
  // getAllReports(): Observable<Report[]> {
  //   const authToken = this.retrieveUserData();
  
  //   // Créer les en-têtes HTTP avec le jeton d'authentification
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${authToken}`
  //   });
  
  //   // Retourner l'observable résultant de la requête HTTP
  //   return this.httpClient.get<Report[]>(this.API_URL, { headers: headers });
  // }
  addReport(Report: Report): void {
    this.dialogData = Report;

    // this.httpClient.post(this.API_URL, Report)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = Report;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateReport(Report: Report): void {
    this.dialogData = Report;
    // this.httpClient.put(this.API_URL + Report.id, Report)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = Report;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteReport(id: number): void {
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
  private retrieveUserData() {
    const cookieData = this.cookieService.get('user_data');
    if (cookieData) {
      try {
        const userData = JSON.parse(cookieData);
        this.authToken = userData.token; // Store user's authentication token
      } catch (error) {
        console.error('Error decoding cookie:', error);
      }
    } else {
      console.error('Cookie "user_data" is not set');
    }
  }
}
