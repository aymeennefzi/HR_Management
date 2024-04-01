import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Departement } from '../../departement.model';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
// import { DialogData } from 'app/contacts/form/form.component';
import { EmployeesService } from '../../departement.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
export interface DialogData {
  id: string;
  action: string;
  employees: Departement;
  selectedItem?: any;
}
@Component({
  selector: 'app-form-dialog',
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
    CommonModule
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle!: string;
  employeesForm: UntypedFormGroup;
  heros!:Departement[];
  employees!: Departement;
  selectedItem: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public employeesService: EmployeesService,
    private fb: UntypedFormBuilder
  ) {
    
    this.employeesForm = new UntypedFormGroup({});
    console.log('Employee ID:', data.id);
    // Set the defaults
    this.action = data.action;
    // if (this.action === 'edit' && data.employees && data.employees.name) {

    //   this.dialogTitle = data.employees.name;
    //   this.employees = data.employees;
    //   console.log(this.data.employees.name); 
    // } 
    if (this.action === 'edit' && this.data.id) {
      this.employeesService.getDepartementById(data.id).subscribe(employee => {
        console.log(employee);
        employee.name = employee.name.toUpperCase();
        this.dialogTitle = employee.name;
        this.employees = employee;
        this.initEmployeeForm();
          // Assigner les valeurs du formulaire avec les données de l'employé récupéré
      this.employeesForm.patchValue({
        _id: this.employees._id,
        name: this.employees.name,
        description: this.employees.description,
        totalEmployees: this.employees.totalEmployees,
        vacantPositions: this.employees.vacantPositions,
        recruitmentNeeds: this.employees.recruitmentNeeds,
        budgetAllocated: this.employees.budgetAllocated,
        salaryExpenditure: this.employees.salaryExpenditure,
        trainingExpenditure: this.employees.trainingExpenditure,
      });
      //  this.employeesForm = this.createContactForm();
      });
    }
    
    else {
      this.dialogTitle = 'New Employees';
      // const blankObject = {} as Departement;
      // Au lieu de passer un argument à la classe Departement, instanciez-la simplement sans argument
      const blankObject = new Departement();

      this.employees = blankObject;
      this.initEmployeeForm();
      // this.employeesForm = this.createContactForm();
    }
    // this.employeesForm = this.createContactForm();
  }
  ngOnInit(): void {
  this.fb.group({
    // id: [this.jobsList._id], // Assurez-vous que l'ID est initialisé correctement
    // title: [this.jobsList.title, Validators.required],
    name:[this.employees.name,Validators.required],
    description:[this.employees.name,Validators.required],
    totalEmployees: [this.employees.totalEmployees,Validators.required],
    vacantPositions: [this.employees.vacantPositions,Validators.required],
    recruitmentNeeds:[this.employees.recruitmentNeeds,Validators.required],
    budgetAllocated: [this.employees.budgetAllocated,Validators.required],
    salaryExpenditure:[this.employees.salaryExpenditure,Validators.required],
    trainingExpenditure:[this.employees.trainingExpenditure,Validators.required]
  })
  if (this.action === 'edit' && this.data.id) {
    this.employeesService.getDepartementById(this.data.id).subscribe(employee => {
      console.log(employee);
      employee.name = employee.name.toUpperCase();
      this.dialogTitle = employee.name;
      this.employees = employee;
      this.initEmployeeForm();
        // Assigner les valeurs du formulaire avec les données de l'employé récupéré
    this.employeesForm.patchValue({
      _id: this.employees._id,
      name: this.employees.name,
      description: this.employees.description,
      totalEmployees: this.employees.totalEmployees,
      vacantPositions: this.employees.vacantPositions,
      recruitmentNeeds: this.employees.recruitmentNeeds,
      budgetAllocated: this.employees.budgetAllocated,
      salaryExpenditure: this.employees.salaryExpenditure,
      trainingExpenditure: this.employees.trainingExpenditure,
    });
     this.employeesForm = this.createContactForm();
    });
  }
  else {
    this.dialogTitle = 'New Employees';
    // const blankObject = {} as Departement;
    // Au lieu de passer un argument à la classe Departement, instanciez-la simplement sans argument
    const blankObject = new Departement();

    this.employees = blankObject;
    this.initEmployeeForm();
    // this.employeesForm = this.createContactForm();
  }
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
        _id:[this.employees._id],
        name:[this.employees.name],
        description:[this.employees.description],
        totalEmployees:[this.employees.totalEmployees],
        vacantPositions:[this.employees.vacantPositions],
        recruitmentNeeds: [this.employees.recruitmentNeeds],
        budgetAllocated:[this.employees.budgetAllocated],
        salaryExpenditure:[this.employees.salaryExpenditure],
        trainingExpenditure:[this.employees.trainingExpenditure],
    });
  }
  initEmployeeForm(): void {
    this.employeesForm = this.createContactForm();
   
  }
  submit() {
    // emppty stuff
    if (this.action === 'edit') {
      console.log("sss",this.employeesForm.value)
      const updatedEmployeeData = this.employeesForm.getRawValue(); // Récupérer les données du formulaire modifié

      // Appeler la méthode update du service EmployeeService pour mettre à jour les données de l'employé
      this.employeesService.updateEmployees(updatedEmployeeData).subscribe(
          (response) => {
             
              console.log('Employee updated successfully', response);
              this.dialogRef.close(); 
              alert('Updated successfully');// Fermer le dialogue après la mise à jour réussie
          },
          (error) => {
              // Gérer les erreurs de la requête de mise à jour si nécessaire
              console.error('Error updating employee', error);
          }
      );
  }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // public confirmAdd(): void {
  //   this.employeesService.addDepartement(this.employeesForm.getRawValue());
  // }
  public confirmAdd(): void {
    const departmentData = this.employeesForm.getRawValue(); // Récupérer les données du formulaire
  
    this.employeesService.addDepartement(departmentData).subscribe(
      (response) => {
        // Gérer la réponse de la méthode addDepartement si nécessaire
        console.log('Department added successfully', response);
        this.dialogRef.close();
        alert('Department added successfully');
      },
      (error) => {
        // Gérer les erreurs de la méthode addDepartement si nécessaire
        console.error('Error adding department', error);
      }
    );
  }
}
