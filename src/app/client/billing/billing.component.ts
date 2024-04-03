import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CalendarService } from 'app/calendar/calendar.service';
import { User } from '@core';
import { CommonModule } from '@angular/common';
import { MatCellDef } from '@angular/material/table';
import { Calendar } from 'app/calendar/calendar.model';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, MatIconModule , CommonModule , MatCellDef],
})
export class BillingComponent implements OnInit{
  employeesWithAttendances: User[] = [];
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor(private canladerS : CalendarService) {
    // constructor
  }
  ngOnInit(): void {
    this.getAllUsersWithAttendances();

  }
  getAllUsersWithAttendances(): void {
    this.canladerS.getAllEmployeesWithAttendances().subscribe(
      users => {
        this.employeesWithAttendances = users;
        console.log(this.employeesWithAttendances); // Affiche les utilisateurs avec leurs présences dans la console
      },
      error => {
        console.error('Une erreur est survenue lors de la récupération des utilisateurs:', error);
      }
    );
  }
  getDayOfWeek(dateString: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }
  validatePresence(personnelId: string, attendances: Calendar[]): void {
    this.canladerS.validatePresence(personnelId, attendances)
      .pipe(
        catchError(error => {
          console.error('Une erreur est survenue:', error);
          // Gérez l'erreur selon vos besoins, par exemple affichez un message d'erreur à l'utilisateur
          return throwError('Une erreur est survenue lors de la validation de la présence.');
        })
      )
      .subscribe(() => {
        // La requête a réussi, faites quelque chose si nécessaire
      });
  }
  approveAttendance(personnelId: string, attendance: Calendar): void {
    // Displaying the confirmation alert to approve the attendance
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to approve this attendance?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // If user confirms, update the attendance status and call validatePresence
            attendance.etat = 'Approved'; 
            const attendances: Calendar[] = [attendance]; // Put the attendance object into an array as attendances
            this.validatePresence(personnelId, attendances);
            // Show a success alert indicating that the attendance has been approved
            Swal.fire('Approved!', 'The attendance has been approved successfully.', 'success');
        }
    });
}
declineAttendance(personnelId: string, attendance: Calendar): void {
  // Displaying the confirmation alert to decline the attendance
  Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to decline this attendance?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, decline',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.isConfirmed) {
          // If user confirms, update the attendance status and call validatePresence
          attendance.etat = 'Declined'; 
          const attendances: Calendar[] = [attendance]; // Put the attendance object into an array as attendances
          this.validatePresence(personnelId, attendances);
          // Show a success alert indicating that the attendance has been declined
          Swal.fire('Declined!', 'The attendance has been declined successfully.', 'success');
      }
  });
}
getStatusColor(etat: string | undefined): string {
  switch (etat) {
    case 'Approved':
      return 'green'; // ou toute autre couleur appropriée pour approuvé
    case 'Declined':
      return 'red'; // ou toute autre couleur appropriée pour refusé
    case 'Pending':
      return 'blue'; // ou toute autre couleur appropriée pour en attente
    default:
      return 'black'; // ou la couleur par défaut
  }
}

formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
} 
}
