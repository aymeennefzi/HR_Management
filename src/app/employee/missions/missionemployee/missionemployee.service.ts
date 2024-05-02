import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMissionDto } from '@core/Dtos/CreateMission.Dto';
import { Mission } from '@core/models/mission';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionemployeeService extends UnsubscribeOnDestroyAdapter {
  private baseUrl = 'http://localhost:3000/missions'; 
  isTblLoading = true;
  public dataChange: BehaviorSubject<Mission[]> = new BehaviorSubject<Mission[]>([]);
  dialogData!: Mission;


  constructor(private http: HttpClient,private cookieService:CookieService) {
    super();
  }

  assignUserToMission(missionId: string, userId: string): Observable<Mission> {
    const data = { missionId, userId };
    return this.http.post<Mission>(`${this.baseUrl}/assign-user`, data);
  }
  getDialogData() {
    return this.dialogData;
  }

  createMission(createMissionDto: CreateMissionDto): Observable<Mission> {
    return this.http.post<Mission>(`${this.baseUrl }/create`, createMissionDto);
  }
  
  updateDataChange(missions: Mission[]): void {
    this.dataChange.next(missions);
  }

  getDataChange(): Observable<Mission[]> {
    return this.dataChange.asObservable();
  }
  get data(): Mission[] {
    return this.dataChange.value;
  }
 
  addMission(missions: Mission): void {
    this.dialogData = missions;

  
  }
  deleteMission(missionId: string): Observable<void> {
   const url = `${this.baseUrl}/${missionId}`;
    return this.http.delete<void>(url)
 
}
updateMission(missionId: string, updateMissionDto: CreateMissionDto): Observable<Mission> {
  const url = `${this.baseUrl}/${missionId}`;
  return this.http.put<Mission>(url, updateMissionDto);
}
deleteMultipleMissions(missionIds: (string | undefined)[]): Observable<void> {
  const filteredMissionIds= missionIds.map(id => id?.toString());
  const url = `${this.baseUrl}/delete-multiple`;
  return this.http.delete<void>(url);
}

// getAllMissionse():  Observable<any[]> {
//   const clientId = this.getTokenFromCookie();
//   console.log("Fetching missions for client ID:", clientId); // Ajouter un log avant la requête HTTP

//   if (!clientId) {
//     throw new Error('ID du client introuvable dans le cookie.');
//   }

//   this.subs.sink = this.http.get<Mission| Mission[]>(${this.baseUrl}/employee/${clientId}).subscribe({
//     next: (data: any) => {
//       const missionsArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
//       console.log("data", missionsArray);
//       console.log("Missions fetched successfully:", data); // Ajouter un log après la récupération des données
//       this.isTblLoading = false;
//       this.dataChange.next(missionsArray);
//     },
//     error: (error: HttpErrorResponse) => {
//       console.log('Erreur lors de la récupération des missions:', error); // Ajouter un log en cas d'erreur
//       this.isTblLoading = false;
//       console.error(error.name + ' ' + error.message);
//     },
//   });
// }

getAllMissionse(): Observable<Mission[]> {
  const clientId = this.getTokenFromCookie();
 // Ajouter un log avant la requête HTTP

  if (!clientId) {
    throw new Error('ID du client introuvable dans le cookie.');
  }

  return this.http.get< Mission |Mission[]>(`${this.baseUrl}/employee/${clientId}`).pipe(
    tap((data:any) => {
       const missionsArray = Array.isArray(data) ? data : [data];
   // Ajouter un log après la récupération des données
      this.isTblLoading = false;
      this.dataChange.next(missionsArray);
    }),
    catchError((error: HttpErrorResponse) => {
   // Ajouter un log en cas d'erreur
      this.isTblLoading = false;
   
      return throwError(error); // Renvoyer l'erreur pour la traiter ultérieurement
    })
  );
}

  createAndAssignMission(createMissionDto: CreateMissionDto): Observable<Mission> {
    const clientId=  this.getTokenFromCookie();
    const url = `${this.baseUrl}/${clientId}`;
    return this.http.post<Mission>(url, createMissionDto);
  }
  getTokenFromCookie(): string | null {
    if (this.cookieService.check('token')) {
      let s =this.cookieService.get('token');

      return s;
    } else {
      return null;
    }
  }
 

 

}