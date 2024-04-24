import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMissionDto } from '@core/Dtos/CreateMission.Dto';
import { Mission } from '@core/models/mission';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

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

    console.log(this.getTokenFromCookie());
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

getAllMissions(): void {
  const employeeId = this.getTokenFromCookie();

  if (!employeeId) {
    console.log("erreur dans id");

    throw new Error('ID du client introuvable dans le cookie.');
  }

  this.subs.sink = this.http.get<Mission | Mission[]>(`${this.baseUrl}/employee/${employeeId}`).subscribe({
    next: (data: Mission | Mission[]) => {
      const missionsArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
      console.log("inside getall")
      console.log(missionsArray)
      this.isTblLoading = false;
      this.dataChange.next(missionsArray); // Assign array of Mission objects
      console.log(this.dataChange);
    },
    error: (error: HttpErrorResponse) => {
      this.isTblLoading = false;
      console.log(error.name + ' ' + error.message);
    },
  });
}
  createAndAssignMission(createMissionDto: CreateMissionDto): Observable<Mission> {
    const clientId=  this.getTokenFromCookie();
    const url = `${this.baseUrl}/${clientId}`;
    return this.http.post<Mission>(url, createMissionDto);
  }
  getTokenFromCookie(): string | null {
    if (this.cookieService.check('token')) {
      let s =this.cookieService.get('token');
      console.log(s);
      return s;
    } else {
      return null;
    }
  }
 

 

}
