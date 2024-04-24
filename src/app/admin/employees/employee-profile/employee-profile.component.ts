import { Component, ElementRef, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmployeesService } from '../allEmployees/employees.service';
import { Employees } from '../allEmployees/employees.model';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FileUploadComponent,


  ],
})
export class EmployeeProfileComponent implements OnInit  {
  user!: Employees;
  docForm!: UntypedFormGroup;
  private elementRef!: ElementRef // Injectez ElementRef

  constructor(private fb: UntypedFormBuilder , private emploueeS : EmployeesService , private cookieService : CookieService) {
    this.docForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      location: [''],
      Tel: ['', ],
      city: [''],
      adresse: [''],
      country: [''],
      aboutme: [''],
      Matricule: ['',],
      education: ['', ],
      experience: [''],
      skills: [''],
      datebirth: [''],
      EmailSecondaire: [''],
      uploadImg: [''],

    });
  }
  
  ngOnInit(): void {
  this.loadUserData();
    }
    loadUserData(): void {
      const cookieData = this.cookieService.get('user_data');
      const userData = JSON.parse(cookieData);
      const id = userData.user.id;
      this.emploueeS.getUserById(id).subscribe({
        next: (user: Employees) => {
          this.user = user;
          this.docForm.patchValue(user);
        }
      });
    }
  
    onSubmit(): void {
      if (this.docForm.valid) {
        const cookieData = this.cookieService.get('user_data');
        const userData = JSON.parse(cookieData);
        const id = userData.user.id;
        const updatedEmployeeData = this.docForm.value;
        this.emploueeS.updateUser(id , updatedEmployeeData).subscribe(updatedEmployee =>{
          alert('update sucess')
          this.loadUserData();
          const aboutMeSection = this.elementRef.nativeElement.querySelector('#aboutMeSection');
          if (aboutMeSection) {
            aboutMeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })
      }
    }
  
}
