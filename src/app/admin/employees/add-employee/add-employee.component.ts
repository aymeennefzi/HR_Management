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
  constructor(private fb: UntypedFormBuilder , private employeS : EmployeesService , private router: Router) {
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
    });
  }
  onSubmit(): void {
    if (this.docForm.valid) {
      console.log('Form Value', this.docForm.value);
      this.employeS.signUp(this.docForm.value).subscribe({
        next: (response) => {
          console.log('Inscription réussie. Token reçu :', response.token);
          // Naviguer vers la route 'allEmployees' après l'inscription réussie
          this.router.navigate(['/admin/employees/allEmployees']);
        },
        error: (error) => {
          console.error("Une erreur s'est produite lors de l'inscription :", error);
        }
      });
    } else {
      console.log('Formulaire invalide. Veuillez corriger les erreurs.');
    }
  }
}
