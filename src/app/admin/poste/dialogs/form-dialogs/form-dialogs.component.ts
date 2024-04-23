import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'app/admin/projects/all-projects/core/project.service';
import { AuthService } from '@core';
import { PosteService } from '../../poste.service';
import { Poste } from '../../Poste.model';
import { MatTable } from '@angular/material/table';
import { CommonModule } from '@angular/common';
export interface DialogData {
  _id: String;
  action: string;
  Poste: Poste;

  
}

@Component({
    selector: 'app-form-dialog:not(k)',
    templateUrl: './form-dialogs.component.html',
    styleUrls: ['./form-dialogs.component.scss'],
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
        CommonModule
        
    ],
})
export class FormDialogComponent implements OnInit {
  @Output() posteAdded: EventEmitter<any> = new EventEmitter();
  PosteId!: string;
  action!: string;
  PosteForm!: FormGroup;
  dialogTitle: string;

  constructor(
    private dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private PosteService: PosteService
  ) {
    this.dialogTitle = this.data.dialogTitle;
  }

  ngOnInit() {
    this.PosteForm = this.formBuilder.group({
      PostName: ['', Validators.required],
      BasicSalary: ['', Validators.required],
      Workshour: ['', Validators.required]
    });
  
    console.log('Data:', this.data); // Voir ce que contient this.data
  
    if (this.data  && this.data.action === 'EDIT') {
      console.log('PosteId:', this.data.PosteId);
      console.log('Poste data:', this.data);
      this.action = 'EDIT';
      this.PosteId = this.data.PosteId;
      this.initializeFormWithPostData(this.data.poste);
    } else {
      this.action = 'ADD';
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }

  savePoste(): any {
    if (this.PosteForm.valid) {
      const postData: Poste = this.PosteForm.value;
      console.log('Data to save:', postData);

      if (this.action === 'ADD') {
        this.PosteService.createPost(postData).subscribe(
          (response) => {
            console.log('Poste created:', response);
            this.PosteForm.reset();
            this.posteAdded.emit();
            this.dialogRef.close(response);
          },
          (error) => {
            console.error('Error creating Poste:', error);
          }
        );
      } else if (this.action === 'EDIT') {
        console.log('Data to send for update:', postData);
        this.PosteService.updatePoste(this.PosteId, postData).subscribe(
          (response) => {
            console.log('Poste updated successfully:', response);
            this.posteAdded.emit();
            this.dialogRef.close(response);
          },
          (error) => {
            console.error('Error updating Poste:', error);
          }
        );
      }
    } else {
      // Le formulaire n'est pas valide, affichez des messages d'erreur si nécessaire
    }
  }

  initializeFormWithPostData(post: Poste): void {
    console.log('Initializing form with post data:', post);
    this.PosteForm.patchValue({
      PostName: post.PostName,
      BasicSalary: post.BasicSalary,
      Workshour: post.Workshour
    });
  }
  
}