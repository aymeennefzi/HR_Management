import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MyLeaves } from '../../my-leaves.model';
import { MyLeavesService } from '../../my-leaves.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import { MyLeavesComponent } from '../../my-leaves.component';
import { NotifcationServiceService } from 'app/layout/header/Notifcation.service';

export interface DialogData {
  id: number;
  action: string;
  myLeaves: MyLeaves;
}

@Component({
    selector: 'app-form-dialog:not(o)',
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
        MatSelectModule,
        MatOptionModule,
        MatDialogClose,
    ],
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  myLeavesForm: UntypedFormGroup;
  myLeaves!: MyLeaves;
  
constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  public myLeavesService: MyLeavesService,
  private fb: UntypedFormBuilder,
  private formBuilder: FormBuilder,
  private cookieService: CookieService,
  private notificationService:NotifcationServiceService
) {
  // Set the defaults
  this.action = data.action;
  if (this.action === 'edit') {
    this.dialogTitle = 'Edit Leave Request';
    this.myLeaves = data.myLeaves;
    this.myLeavesForm = this.createContactForm();
    this.myLeavesForm.patchValue(this.myLeaves); // Update form controls with MyLeaves data
  } else {
    this.dialogTitle = 'New Leave Request';
    const blankObject = {} as MyLeaves;
    this.myLeaves = new MyLeaves();
    Object.assign(this.myLeaves, blankObject);
    this.myLeavesForm = this.createContactForm();
  }
}
ngOnInit(): void {
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
    startDate: [this.myLeaves.startDate, [Validators.required]],
    endDate: [this.myLeaves.endDate, [Validators.required]],
    startTime: [this.myLeaves.startTime, [Validators.required]],
    endTime: [this.myLeaves.endTime, [Validators.required]],
    leaveType: [this.myLeaves.leaveType, [Validators.required]],
    status: [this.myLeaves.status, [Validators.required]],
    reason: [this.myLeaves.reason, [Validators.required]],
  });
}

submit() {  
  if (this.myLeavesForm.valid) {
    const cookieDataString: string = this.cookieService.get('user_data');
    if (cookieDataString) {
    const cookieData = JSON.parse(decodeURIComponent(cookieDataString));
    if (cookieData && cookieData.user && cookieData.user.id) {
      const personnelId: string = cookieData.user.id;
    const formValue = this.myLeavesForm.value;
    const payload = {
      ...formValue,
      personnelId: personnelId
    };
    if (this.action === 'edit') {
      // Utilize the appropriate update method from the service
      this.myLeavesService.updateMyLeaves(this.myLeaves._id ,payload).subscribe({

        next: (data) => {
        },
        error: (error) => {
        }
      });
    } else {
      this.myLeavesService.addMyLeaves(payload).subscribe({
        next: (data) => {
         const notificationDetails = {
          title: 'New Project Added',
          description: `Project ${payload.name} has been successfully added.`,
     
        };
        
        this.notificationService.createNotification( notificationDetails).subscribe(() => {
          alert('Project added and notification sent!');
        }, error => {
        });
        },
        error: (error) => {
        }
      });
    }
  } else {
  }
}
  }
}

onNoClick(): void {
  this.dialogRef.close();
}
}