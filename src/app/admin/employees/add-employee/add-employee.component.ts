import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmployeesService } from '../allEmployees/employees.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    FileUploadComponent,
    MatButtonModule,
  ],
})
export class AddEmployeeComponent {
  docForm: UntypedFormGroup;

  hide3 = true;
  agree3 = false;
  constructor(private fb: UntypedFormBuilder , private employeS : EmployeesService , private router: Router,private cookieService:CookieService) {

    this.docForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: [''],
      email: [''],
      etablissement: ['', [Validators.required]],
      EmailSecondaire: ['', ],
      TelSecondaire: ['', [Validators.required]],
      dateEntree: [''],
      fonction: [''],
      Tel: [''],
      Matricule: ['',],
      password: ['', [Validators.required]],
      roleName: [''],
      soldeConges: [''],
      soldeMaladie: [''],
      uploadImg:[''],

    });
  }
  
  addFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.docForm.patchValue({
        uploadImg: file
      });
    }
  }
  
  onSubmit(): void {

    const payload=new FormData();
    payload.append('firstName',this.docForm.value.firstName);
    payload.append('lastName',this.docForm.value.lastName);
    payload.append('email',this.docForm.value.email);
    payload.append('etablissement',this.docForm.value.etablissement);
    payload.append('EmailSecondaire',this.docForm.value.EmailSecondaire);
    payload.append('TelSecondaire',this.docForm.value.TelSecondaire);
    payload.append('dateEntree',this.docForm.value.dateEntree);
    payload.append('fonction',this.docForm.value.fonction);
    payload.append('Tel',this.docForm.value.Tel);
    payload.append('Matricule',this.docForm.value.Matricule);
    payload.append('password',this.docForm.value.password);
    payload.append('roleName',this.docForm.value.roleName);
    payload.append('soldeConges',this.docForm.value.soldeConges);
    payload.append('soldeMaladie',this.docForm.value.soldeMaladie);
    payload.append('profileImage',this.docForm.value.profileImage);  

    if (this.docForm.valid) {
      this.employeS.signUp(this.docForm.value).subscribe({
        next: (response) => {
          // Naviguer vers la route 'allEmployees' après l'inscription réussie
          this.router.navigate(['/admin/employees/allEmployees']);
        },
        error: (error) => {
          console.error("Une erreur s'est produite lors de l'inscription :", error);
        }
      });
    } else {
    }
  }
}
