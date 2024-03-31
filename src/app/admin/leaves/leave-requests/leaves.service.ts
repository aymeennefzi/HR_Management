import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Leaves } from './leaves.model';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class LeavesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:3000/Conge';

  isTblLoading = true;
  dataChange: BehaviorSubject<Leaves[]> = new BehaviorSubject<Leaves[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Leaves;

  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Leaves[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  addLeaves(leaves: Leaves): void {
    this.dialogData = leaves;
  }

  refuserDemandeConge(id : string):Observable<Leaves>{
    const url = (this.API_URL + "/" + id + "/refus");
    return this.httpClient.put<Leaves>(url, null);
  }

  accepterDemandeConge(id: string): Observable<Leaves> {
    const url = (this.API_URL + "/" + id + "/accept");
    return this.httpClient.put<Leaves>(url, null);
  }
  updateLeaves(leaves: Leaves): void {
    this.dialogData = leaves;
  }
  deleteLeaves(id: number): void {
    console.log(id);

  }

  getAllUserswithconge(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + "/leaves");
  }
}
