import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Candidates } from './candidates.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:3000/application';
  private apiUrl = 'http://localhost:3000/application/generate'
  downloadExcelUrl = `${this.API_URL}/download`;
  isTblLoading = true;
  dataChange: BehaviorSubject<Candidates[]> = new BehaviorSubject<Candidates[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData!: Candidates;
  constructor(private httpClient: HttpClient) {
    super();
  }
  downloadExcel(): Observable<Blob> {
    // Spécifiez le type de réponse attendue comme Blob
    return this.httpClient.get(this.downloadExcelUrl, {
      responseType: 'blob'
    });
  }
  getcandidates(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.API_URL);
  }
  get data(): Candidates[] {
    return this.dataChange.value;
  }
  // applyforjob(Candidates: Candidates): Observable<Candidates> {
  //   return this.httpClient.post<Candidates>(this.API_URL, Candidates);
  // }
  // Dans CandidatesService
applyforjob(applicationData: FormData): Observable<any> {
  return this.httpClient.post<any>(this.API_URL, applicationData);;
}
deleteCandidate(id: string): Observable<any> {
  const url = `${this.API_URL}/${id}`; // Assurez-vous que c'est le bon endpoint de votre API
  return this.httpClient.delete(url);
}

updateCandidate(id: string, updateCandidateDto: any): Observable<any> {
  const url = `${this.API_URL}/${id}`; // Assurez-vous que l'URL correspond à votre endpoint backend
  return this.httpClient.put(url, updateCandidateDto).pipe(
    catchError((error) => {
      console.error('Error updating candidate:', error);
      throw error; // Gérer l'erreur dans le composant appelant si nécessaire
    })
  );
}
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllCandidatess(): void {
    this.subs.sink = this.httpClient.get<Candidates[]>(this.API_URL).subscribe({
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
  addCandidates(candidates: Candidates): void {
    this.dialogData = candidates;
  }
  updateCandidates(candidates: Candidates): void {
    this.dialogData = candidates;
  }
  deleteCandidates(id: number): void {
    console.log(id);
  }
  generateCv(cvData: any): Observable<Blob> {
    return this.httpClient.post<Blob>(this.apiUrl, cvData, { responseType: 'blob' as 'json' });
}
}
