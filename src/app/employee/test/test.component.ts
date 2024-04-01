import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AttendancesService } from '../attendance/attendance.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { an } from '@fullcalendar/core/internal-common';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule, MatSelectModule,MatButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  attendanceListe: any[] = [];
  columns: string[] = ['_id', 'date', 'etat', 'status'];
  attendanceListeEnum: any[] = [
    'present', 'abscent', 'halfday'
  ];
  payload!: any;
  daysOfWeek: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  ngOnInit() {
    // this.loadData();
    this.getattendance();
  }

  constructor(
    public httpClient: HttpClient,
    // public dialog: MatDialog,
    public attendancesService: AttendancesService,
    // private snackBar: MatSnackBar
  ) {

  }
  getattendance() {
    this.attendancesService.getAttendance().subscribe({
      next: (data: any) => {
        this.attendanceListe = data;
        console.log(this.attendanceListe)
      },
      error: () => {

      }
    })
  }
  onStatusChange(selectedStatus: string, attendance: any) {
    console.log(selectedStatus)
    if (selectedStatus != null || selectedStatus != undefined) {
     
      this.payload = {
        selectedStatus: attendance.selectedStatus,
       
        attendance: attendance
      }
      console.log(this.payload)
    }
  }
  Save(){
    this.attendancesService.Pointer(this.payload).subscribe({
      next:(data: any)=>{
        console.log(data)
      },
      error:()=>{
        alert("somthing was warrning")
      }
    })
  }

}
