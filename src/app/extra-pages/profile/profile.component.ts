import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmployeesService } from 'app/admin/employees/allEmployees/employees.service';
import { CookieService } from 'ngx-cookie-service';
import { Employees } from 'app/admin/employees/allEmployees/employees.model';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class ProfileComponent {
  user!: Employees;

  constructor(private emploueeS : EmployeesService , private cookieService : CookieService) {
    // constructor
  }
  getUserById(): void {
    const cookieData = this.cookieService.get('user_data');
    const userData = JSON.parse(cookieData);
    const id = userData.user.id;
    this.emploueeS.getUserById(id).subscribe({
      next: (user: Employees) => {
        this.user = user;
        console.log('Utilisateur récupéré :', user);
      },
      error: (error) => {
        console.error("Une erreur s'est produite lors de la récupération de l'utilisateur :", error);
      }
    });
  }
}
