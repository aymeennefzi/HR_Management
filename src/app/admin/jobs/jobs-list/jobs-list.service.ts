import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { JobsList, Skill } from './jobs-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class JobsListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:3000/job';
  private readonly APII_URL = 'http://localhost:3000/skill';
  isTblLoading = true;
  dataChange: BehaviorSubject<JobsList[]> = new BehaviorSubject<JobsList[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: JobsList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): JobsList[] {
    return this.dataChange.value;
  }
  getJobs(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.API_URL);
  }
  deleteJob(jobId: string): Observable<any> {
    const url = `${this.API_URL}/${jobId}`;
    return this.httpClient.delete(url);
  }
  getOpenJobs(): Observable<string[]> {
    return this.httpClient.get<JobsList[]>(this.API_URL).pipe(
      map((jobs: JobsList[]) => jobs.filter(job => job.status === 'Open').map(job => job.title))
    );
  }
  getJobTitleById(jobId: string): Observable<string> {
    return this.httpClient.get<string>(`${this.API_URL}/${jobId}/title`);
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllJobsLists(): void {
    this.subs.sink = this.httpClient.get<JobsList[]>(this.API_URL).subscribe({
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
  getSkills(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(`${this.APII_URL}`);
  }
  updateJob(job: JobsList): Observable<JobsList> {
    const url = `${this.API_URL}/${job._id}`; // Utilisez l'ID du job pour construire l'URL de mise à jour
    return this.httpClient.put<JobsList>(url, job);
  }
  addSkill(skill: Skill): Observable<Skill> {
    return this.httpClient.post<Skill>(this.APII_URL, skill);
  }

  addJobsList(jobsList: JobsList): void {
    this.dialogData = jobsList;

    // this.httpClient.post(this.API_URL, jobsList)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = jobsList;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  addJob(job: JobsList): Observable<JobsList> {
    return this.httpClient.post<JobsList>(this.API_URL, job);
  }
  updateJobsList(jobsList: JobsList): void {
    this.dialogData = jobsList;

    // this.httpClient.put(this.API_URL + jobsList.id, jobsList)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = jobsList;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteJobsList(id: number): void {
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
