import { BehaviorSubject, Observable } from 'rxjs';
import { MyLeaves } from './my-leaves.model';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class MyLeavesService extends UnsubscribeOnDestroyAdapter {
  private leaves: any[] = [];
  public leavesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private readonly API_URL = 'http://localhost:3000/Conge';
  isTblLoading = true;
  dataChange: BehaviorSubject<MyLeaves[]> = new BehaviorSubject<MyLeaves[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: MyLeaves;
  constructor(private httpClient: HttpClient) {
    super();
  }

  
  get data(): MyLeaves[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllMyLeaves(): void {
    this.subs.sink = this.httpClient.get<MyLeaves[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
        console.log(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }


  getleavesByemployeeId(id: number): Observable<MyLeaves[]> {
    return this.httpClient.get<MyLeaves[]>(this.API_URL + "/" + id + "/leaves");
  }
  addMyLeaves(myLeaves: MyLeaves): Observable<MyLeaves> {
    return this.httpClient.post<MyLeaves>(this.API_URL + '/request' , myLeaves)
  }
  updateMyLeaves(id : string , myLeaves: MyLeaves): Observable<MyLeaves> {
    return this.httpClient.put<MyLeaves>(this.API_URL + '/' + id , myLeaves)
  }
  deleteMyLeaves(id: string): void {
    console.log(id);
    this.httpClient.delete(this.API_URL + "/" +  id)
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
