import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeesService } from '../../employees.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Employees } from '../../employees.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
export interface DialogData {
  id: number;
  action: string;
  employees: Employees;
}
@Component({
    selector: 'app-form-dialog:not(c)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatDialogClose,
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  employeesForm: UntypedFormGroup;
  employees: Employees;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public employeesService: EmployeesService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.employees.firstName;
      this.employees = data.employees;
    } else {
      this.dialogTitle = 'New Employees';
      this.employees = new Employees(); // Utiliser le constructeur sans argument
    }
    this.employeesForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.employees._id],
      img: [this.employees.img],
      firstName: [this.employees.firstName],
      lastName: [this.employees.lastName],
      etablissement: [this.employees.etablissement],
      dateEntree: [this.employees.dateEntree],
      fonction: [this.employees.fonction],
      password: [this.employees.password],
      TelSecondaire: [this.employees.TelSecondaire],
      EmailSecondaire: [this.employees.EmailSecondaire],
      Matricule: [this.employees.Matricule],
      email: [this.employees.email],
      roleName: [this.employees.roleName],
      Tel: [this.employees.Tel],
      soldeConges: [this.employees.soldeConges],
      soldeMaladie: [this.employees.soldeMaladie],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.employeesService.addEmployees(this.employeesForm.getRawValue());
  }
}
