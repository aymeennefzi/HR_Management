import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { User } from '@core';
import { CalendarService } from 'app/calendar/calendar.service';
import { Calendar } from 'app/calendar/calendar.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-attendance-sheet',
  templateUrl: './attendance-sheet.component.html',
  styleUrls: ['./attendance-sheet.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    CommonModule
  ],
})
export class AttendanceSheetComponent implements OnInit {
  users: User[] = [];
  attendanceForm: UntypedFormGroup;
  monthDates: number[] = [];

  constructor(private calanderS : CalendarService) {
    this.attendanceForm = new UntypedFormGroup({
      fromDate: new UntypedFormControl(),
      toDate: new UntypedFormControl(),
    });
  }

  ngOnInit(): void {
    this.getUsersWithAttendances();
  }

  getUsersWithAttendances(): void {
    this.calanderS.getUsersWithAttendances().subscribe({
      next: (users: User[]) => {
        this.users = users; 
      },
      error: (error) => {
        console.error('Error fetching users with attendances:', error); 
      }
    });
  }
  getAttendanceIcon(attendance: Calendar): string {
    switch (attendance.etat) {
      case 'Pending':
        return 'fas fa-adjust col-orange';
      case 'Approved':
        return 'far fa-check-circle text-success';
      case 'Declined':
        return 'far fa-times-circle text-danger';
      default:
        return '';
    }
  }
  generateMonthDates(): void {
    const currentDate = new Date();
    const numDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    this.monthDates = Array.from({ length: numDays }, (_, i) => i + 1);
  }
}
