import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Mission } from '@core/models/mission';
import { CreateMissionDto } from '@core/Dtos/CreateMission.Dto';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class TheMissionService extends UnsubscribeOnDestroyAdapter {
  private baseUrl = 'http://localhost:3000/missions'; 
  isTblLoading = true;
  public dataChange: BehaviorSubject<Mission[]> = new BehaviorSubject<Mission[]>([]);
  dialogData!: Mission;


  constructor(private http: HttpClient) {
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
    return this.http.post<Mission>(`${this.baseUrl}/addmission`, createMissionDto);
  }

  // getAllMissions(): Observable<Mission[]> {
  //   return this.http.get<Mission[]>(`${this.baseUrl}`);
  // }

  // Méthode pour mettre à jour la valeur de dataChange
  updateDataChange(missions: Mission[]): void {
    this.dataChange.next(missions);
  }

  getDataChange(): Observable<Mission[]> {
    return this.dataChange.asObservable();
  }
  get data(): Mission[] {
    return this.dataChange.value;
  }
  getAllMissions(): void {
    this.subs.sink = this.http.get<Mission[]>(this.baseUrl).subscribe({
      next: (data:any) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
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
}}