import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Calendar, Holidayss } from './calendar.model';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Attendances } from 'app/employee/attendance/attendance.model';
import { User } from '@core';

@Injectable({
  providedIn: 'root',
})

export class CalendarService {
  private readonly API_URL = 'http://localhost:3000/auth';

  // private readonly API_URL = 'assets/data/calendar.json';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Calendar;
  constructor(private httpClient: HttpClient) { }
  get data(): Calendar[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getAllCalendars(): Observable<Calendar[]> {
    return this.httpClient
      .get<Calendar[]>(this.API_URL)
      .pipe(catchError(this.errorHandler));
  }

  addUpdateCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  deleteCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  updateAttendanceList(personnelId: string, attend: Calendar[]): Observable<void> {
    return this.httpClient.post<void>(this.API_URL + "/att/" + personnelId , attend);
  }
  getAttendancesForUser(userId: string): Observable<Calendar[]> {
    return this.httpClient.get<Calendar[]>(this.API_URL + "/" +  userId);
  }
  private readonly API_URL1 = 'http://localhost:3000/holidays';
  private readonly API_URL2 = 'http://localhost:3000/attendance';


  getAllHolidays(): Observable<Holidayss[]> {
    return this.httpClient.get<Holidayss[]>(this.API_URL1);
  }
  getAllEmployeesWithAttendances(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL2 + "/currentWeek");
  }
  validatePresence(personnelId: string, attend: Calendar[]): Observable<void> {
    return this.httpClient.put<void>(this.API_URL2 + "/" + personnelId  + "/validate-presence", attend);
  }
  getUsersWithAttendances(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL2 + "/allusers");
  } 
}