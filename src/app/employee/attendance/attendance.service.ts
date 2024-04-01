import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Attendances } from './attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendancesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/attendance.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Attendances[]> = new BehaviorSubject<
    Attendances[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Attendances;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Attendances[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAttendancess(): void {
    this.subs.sink = this.httpClient
      .get<Attendances[]>(this.API_URL)
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
  getAttendance() {
    let id_user="65f195dd0f04705fe41b3838";

  // return this.httpClient.get(`http://localhost:3000/auth/${id_user}/attendances`);
  return this.httpClient.get(`http://localhost:6200/auth/${id_user}/attendances`);
  }
  addAttendances(attendances: Attendances): void {
    this.dialogData = attendances;

    // this.httpClient.post(this.API_URL, attendances)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = attendances;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateAttendances(attendances: Attendances): void {
    this.dialogData = attendances;

    // this.httpClient.put(this.API_URL + attendances.id, attendances)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = attendances;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteAttendances(id: number): void {
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

  Pointer(payload:any){
    let personnelId="65f195dd0f04705fe41b3838"
   return this.httpClient.put(`http://localhost:6100/attendance/${personnelId}/validate-presence`,payload);
  }
}
