import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LeavesService } from '../leaves.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Leaves } from '../leaves.model';
import { formatDate, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  leaves: Leaves;
}

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
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
        MatCardModule,
        DatePipe,
    ],
})
export class FormComponent {
  action: string;
  dialogTitle?: string;
  isDetails = false;
  leavesForm!: UntypedFormGroup;
  leaves: Leaves;
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public leavesService: LeavesService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
  this.action = data.action;
  if (this.action === 'edit') {
    this.dialogTitle = 'Edit Leave Request';
    this.leaves = data.leaves;
    this.leavesForm = this.createContactForm();
    this.leavesForm.patchValue(this.leaves); // Update form controls with MyLeaves data
  } else {
    this.dialogTitle = 'New Leave Request';
    const blankObject = {} as Leaves;
    this.leaves = new Leaves();
    Object.assign(this.leaves, blankObject);
    this.leavesForm = this.createContactForm();
  }
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.type,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('type')
      ? 'Not a valid type'
      : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.leaves._id],
      //img: [this.leaves.img],
      //name: [this.leaves.name],
      type: [this.leaves.leaveType, [Validators.required, Validators.minLength(5)]],
      from: [
        formatDate(this.leaves.startDate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      leaveTo: [
        formatDate(this.leaves.endDate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      reason: [this.leaves.reason],
      noOfDays: [this.leaves.startTime],
      status: [this.leaves.status],
      note: [this.leaves.endTime],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.leavesService.addLeaves(this.leavesForm?.getRawValue());
  }
}
