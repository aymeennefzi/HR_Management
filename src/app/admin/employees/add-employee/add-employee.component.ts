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
import { CommonModule } from '@angular/common';
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
    CommonModule,
    FormsModule,
  ],
})
export class AddEmployeeComponent {
  docForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  constructor(private fb: UntypedFormBuilder, private companyService: EmployeesService) {
    this.docForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      description: [''],
      totalEmployees: ['', [Validators.required]],
      vacantPositions: ['', [Validators.required]],
      recruitmentNeeds: ['', [Validators.required]],
      budgetAllocated: ['', [Validators.required]],
      salaryExpenditure: ['', [Validators.required]],
      trainingExpenditure: ['', [Validators.required]],

    });
  }
  cancel() {
    // Code à exécuter lorsque le bouton "Cancel" est cliqué
  }
  formatCurrency(input: HTMLInputElement) {
    const numericValue = input.value.replace(/\D/g, '');
    const formattedValue = '$' + numericValue;
    input.value = formattedValue;
  }
  
  onSubmit() {
    if (this.docForm.valid) {
      const companyData = this.docForm.value;
      this.companyService.addDepartement(companyData).subscribe(
        response => {
          // Gérer la réponse du backend après l'ajout de l'entreprise
          console.log('Company added successfully!', response);
          // Réinitialisez le formulaire après l'ajout réussi
          this.docForm.reset();
          alert('L\'entreprise a été ajoutée avec succès !');
        },
        error => {
          // Gérer les erreurs de l'ajout d'entreprise
          console.error('Error adding company:', error);
        }
      );
    } else {
      // Affichez les erreurs de validation du formulaire
      console.log('Invalid form data');
    }
  }
    // console.log('Form Value', this.docForm.value);
  }

