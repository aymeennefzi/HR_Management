import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogClose } from '@angular/material/dialog';

import {

 
  ProjectPriority,
  ProjectType,
} from '../core/project.model';
import { ProjectService } from '../core/project.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

export interface DialogData {
  id: number;
  action: string;
  title: string;
  projectId:string;
projectt:any;
projects:any[]
idUser:any
}

@Component({
    selector: 'app-project-dialog',
    templateUrl: './project-dialog.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
    ],
})
export class ProjectDialogComponent {
  public project: any;
 
  _id!: string;
  public dialogTitle: string;
  public projectForm!: UntypedFormGroup;



  constructor(

    private formBuilder: FormBuilder, private actR: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private snackBar: MatSnackBar,
    private projectService: ProjectService
    , private R: Router
  ) {
    this.dialogTitle = data.title;
   
 
 
    }
    ngOnInit(): void {
   
      this.projectForm = this.formBuilder.group({
        
        NomProject: [''],
        description: [''],
        StartDate: [''],
        FinishDate : [''],
        statut: [''],
        priority : [''],
        type:[''],
        NomChefProjet:  [''],
        progress:  [0],
        UserProjectsId: [    this.data.idUser ],
      });
 
   
      if (this.data.projectId) {
      this.projectService.getProjectById(this.data.projectId).subscribe((data) => {
       
        this.project= data;
        const PSansT = {
          _id: this.project._id,
          NomProject: this.project.NomProject,
          description: this.project.description,
          StartDate : this.convertDate(this.project.StartDate),
          FinishDate : this.convertDate(this.project.FinishDate),
          statut : this.project.statut ,
          type:this.project.type,
          priority : this.project.priority  ,
          progress: this.project.progress || 0 ,
          NomChefProjet: this.project.NomChefProjet,
          tasks: this.project.tasks
        };
    
        this.projectForm.patchValue(PSansT );
      
       
      });} 
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  convertDate(dateStr: string): string {
    return moment(dateStr, 'DD-MM-YYYY').format('YYYY-MM-DD');
  }
  updateP() {
    const updatedValues = {
      _id: this.projectForm.value._id,
      NomProject: this.projectForm.value.NomProject,
      description: this.projectForm.value.description,
      StartDate:  moment(this.projectForm.value.StartDate).format('DD-MM-YYYY'), // Converts to string in specified format
      FinishDate:  moment(this.projectForm.value.FinishDate).format('DD-MM-YYYY'),
      statut: this.projectForm.value.statut,
      priority: this.projectForm.value.priority,
      NomChefProjet: this.projectForm.value.NomChefProjet,
      progress:this.projectForm.value.progress,
      type:this.projectForm.value.type,

    };
  
    this.projectService.updateProject(this.data.projectId, updatedValues).subscribe(() => {
      this.R.navigate(['admin/projects/allProjects']);

    });

  }
  public save(): void {
    if (!this.projectForm.valid) {
      return;
    }
    if (this.project) {
      // update project object with form values
   
      Object.assign(this.data.projectt, this.projectForm.value);
      this.updateP()

      this.snackBar.open('Project updated Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    } else {
      const formattedValues = {
        ...this.projectForm.value,
        StartDate: moment(this.projectForm.value.StartDate).format('DD-MM-YYYY'),
        FinishDate: moment(this.projectForm.value.FinishDate).format('DD-MM-YYYY'),
        priority: +this.projectForm.value.priority,
        statut: +this.projectForm.value.statut,
  
   
      };
      // Convert priority to a number if it's not already
      this.projectService.createProject(formattedValues).subscribe(
        (newProject) => {
      
          this.data.projects.push(newProject)

          this.dialogRef.close(this.data.projects);
        }
      );
      this.snackBar.open('Project created Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });


    }
  }
}
