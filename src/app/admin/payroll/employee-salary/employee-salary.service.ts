import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EmployeeSalary } from './employee-salary.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSalaryService extends UnsubscribeOnDestroyAdapter {
   baseUrl = 'http://localhost:3000/payroll';
  isTblLoading = true;
  dataChange: BehaviorSubject<EmployeeSalary[]> = new BehaviorSubject<
    EmployeeSalary[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: EmployeeSalary;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): EmployeeSalary[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  generatePayroll(): Observable<any> {
    const url = `${this.baseUrl}/generate`;
    return this.httpClient.post<any>(url, {});
  }
  getAllPayrollsWithUsersAndPoste(): void {
    this.subs.sink = this.httpClient
      .get<EmployeeSalary[]>('http://localhost:3000/payroll/withUsersAndPoste')
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
        },
      });
  }

  addEmployeeSalary(employeeSalary: EmployeeSalary): void {
    this.dialogData = employeeSalary;
  }
  updateEmployeeSalary(employeeSalary: EmployeeSalary): void {
    this.dialogData = employeeSalary;
  }
  deleteEmployeeSalary(id: number): void {
  }
}
