import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CreateMissionDto } from '@core/Dtos/CreateMission.Dto';
import { MissionService } from '../../mission.service';

export interface DialogData {
  id: string;
  action: string;
  mission: CreateMissionDto;
}

@Component({
  selector: 'app-form-dialog',
  standalone:true,
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  imports :[  MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,CommonModule
  ]
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  missionForm: FormGroup;
  mission: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  };

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private missionService: MissionService
  ) {
    this.action = data.action;
    if (this.action === 'edit' && data.id) {
      this.dialogTitle = data.mission.title;
      this.mission = data.mission;
    } else {
      this.dialogTitle = 'New Mission';
      const blankObject: CreateMissionDto = {
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      };
      this.mission = blankObject;
    }
    this.missionForm = this.createMissionForm();
  }

  createMissionForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.mission.title, Validators.required],
      description: [this.mission.description, Validators.required],
      startDate: [this.mission.startDate, Validators.required],
      endDate: [this.mission.endDate, Validators.required]
    });
  }

  submit() {
    if (this.missionForm.valid) {
      const missionData: CreateMissionDto = {
        title: this.missionForm.value.title,
        description: this.missionForm.value.description,
        startDate: this.missionForm.value.startDate,
        endDate: this.missionForm.value.endDate
      };

      if (this.action === 'edit') {
        this.missionService.updateMission(this.data.id,missionData).subscribe()
       } else {
        this.missionService. createAndAssignMission(missionData).subscribe();
      }

      this.dialogRef.close();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}