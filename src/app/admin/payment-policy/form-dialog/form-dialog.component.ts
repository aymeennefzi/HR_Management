import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LeaveType, PaymentPolicy } from '../PaymentPolicy.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
export interface DialogData {
  _id: string;
  action: string;
  policy: PaymentPolicy;
}
type AllowedDaysGroup = {
  [key in LeaveType]: any;
};

@Component({
    selector: 'app-form-dialog:not(i)',
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
        MatDialogClose,
        MatOptionModule,
        HttpClientModule,CommonModule
    ],
})
export class FormDialogComponent implements OnInit{
  action: string;
  
  PolicyForm: FormGroup;
   leads!: PaymentPolicy;
  leaveTypes: LeaveType[] = Object.values(LeaveType);
  allowedDays: Map<LeaveType, number> = new Map<LeaveType, number>();
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.action = data.action;
    this.leads = {} as PaymentPolicy; // Utiliser data.leads plutôt que data.policy
    this.PolicyForm = this.createContactForm();
    this.leaveTypes.forEach(leaveType => {
      this.allowedDays.set(leaveType, this.leads.allowedDays?.get(leaveType) || 0);
    }); 
  }
  
  ngOnInit(): void {
  
    if (this.action === 'EDIT' ) {
      this.leads = this.data.policy;
  
      const id = this.leads._id;
      // Utilisez this.leads._id pour récupérer l'identifiant
      this.http.get<PaymentPolicy>(`http://localhost:3000/payment-policy/get/${id}`).subscribe(policy => {
        this.leads = policy;
        this.populateForm();
      });
    } else {
      this.populateForm(); // Appel de populateForm pour initialiser le formulaire avec des valeurs par défaut
    }
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      taxRate: [this.leads.taxRate || '', Validators.required],
      socialSecurityRate: [this.leads.socialSecurityRate || '', Validators.required],
      otherDeductions: [this.leads.otherDeductions || '', Validators.required],
      paymentDay: [this.leads.paymentDay || ''],
      exessDayPay: [this.leads.exessDayPay || ''],
      allowedDays: this.createAllowedDaysFormGroup() // Appel de la fonction pour créer le FormGroup pour allowedDays
    });
  }
  
  createAllowedDaysFormGroup(): FormGroup {
    const allowedDaysGroup: { [key: string]: FormControl } = {}; // Utilisation de FormControl pour les contrôles de formulaire
  
    Object.values(LeaveType).forEach(leaveType => {
      const initialValue = this.leads.allowedDays?.get(leaveType) || 0;
      allowedDaysGroup[leaveType] = new FormControl(initialValue, Validators.required); // Initialiser avec un nouveau FormControl
    });
  
    return this.fb.group(allowedDaysGroup);
  }
  submit() {
    if (this.PolicyForm.valid) {
      const formData = this.PolicyForm.value;
      formData.allowedDays = this.allowedDays;
      // Envoyer les données du formulaire au backend
    }
  }
  
  confirmAdd(): void {
    if (this.PolicyForm.valid) {
      const formData = this.PolicyForm.getRawValue();
      const allowedDaysObject: { [key in LeaveType]?: number } = {};
      this.allowedDays.forEach((value, key) => {
        allowedDaysObject[key] = value;
      });
      const paymentPolicy: PaymentPolicy = {
        ...formData,
        allowedDays: allowedDaysObject
      };
      if (this.action === 'ADD') {
        this.http.post<PaymentPolicy>('http://localhost:3000/payment-policy', paymentPolicy)
          .subscribe(
            response => console.log('Payment Policy created successfully:', response),
            error => console.error('Error while creating Payment Policy:', error)
          );
      } else if (this.action === 'EDIT') {
        const policyId = this.leads._id; // Utilisez this.leads._id pour l'identifiant de la politique de paiement
        this.http.put<PaymentPolicy>(`http://localhost:3000/payment-policy/put/${policyId}`, paymentPolicy)
          .subscribe(
            response => console.log('Payment Policy updated successfully:', response),
            error => console.error('Error while updating Payment Policy:', error)
          );
      }
    }
  }
  populateForm(): void {
    this.PolicyForm.patchValue({
      taxRate: this.leads.taxRate,
      socialSecurityRate: this.leads.socialSecurityRate,
      otherDeductions: this.leads.otherDeductions,
      paymentDay: this.leads.paymentDay,
      exessDayPay: this.leads.exessDayPay,
     
    });
}

    createAllowedDaysPatchValue(): AllowedDaysGroup {
      const allowedDaysPatchValue: AllowedDaysGroup = {} as AllowedDaysGroup;
      
      this.leaveTypes.forEach(leaveType => {
        const initialValue = this.leads.allowedDays?.get(leaveType);
        allowedDaysPatchValue[leaveType] = initialValue;
      });
      return allowedDaysPatchValue;
       }
    
  onNoClick(): void {
      this.dialogRef.close();
    }
  updateValue(event: any, leaveType: LeaveType): void {
    const newValue = event.target.value ? parseFloat(event.target.value) : 0;
    this.allowedDays.set(leaveType, newValue);
  }
}