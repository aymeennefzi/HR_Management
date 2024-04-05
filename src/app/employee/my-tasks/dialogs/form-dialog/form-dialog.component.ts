import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MyTasksService } from '../../my-tasks.service';
import {  TasksModel } from '../../my-tasks.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EstimatesService } from 'app/admin/projects/estimates/estimates.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core';
import { ProjectService } from 'app/admin/projects/all-projects/core/project.service';

export interface DialogData {
  id: number;
  action: string;
  task: any;
  taskId:string;
  idProject:string;
  tasks:TasksModel[]
}

@Component({
    selector: 'app-form-dialog:not(p)',
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
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
    ],
})
export class FormDialogComponent {
  action!: string; 
  dialogTitle!: string; 
  taskForm!: UntypedFormGroup ;
taskAdd!:any
  task:any;
  user!:any
  users:any[]=[]
  p!:any
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public estimatesService: EstimatesService,
    private fb: UntypedFormBuilder,
    private actR : ActivatedRoute,
    private authService:AuthService,
    private projectService: ProjectService,
  ) {

  }
/*   estimates: Estimates; */
  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((dataaa)=>this.users=dataaa)
    this.estimatesService.getTasks().subscribe((dataa)=>{this.data.tasks=dataa;  
   })
 
    this.taskForm = this.fb.group({
  
      NomTask: ['', [Validators.required]],
      priority: [''],
  
      startDate: ['', [Validators.required]],
      FinishDate: ['', [Validators.required]],
  
      statut: [''],
       description: ['', [Validators.required]],
       employeeAffected:['', [Validators.required]],
       projectId: [this.data.idProject],
    

  
    });
    this.action =this.data.action;
    if (this.action === 'edit' && this.data.taskId) {
      this.authService.getUserByTaskId( this.data.taskId).subscribe((datauser) => {
this.user=datauser
      });
      this.estimatesService.getTaskById(this.data.taskId).subscribe((dataa) => {
        console.log(this.data.taskId)    
       
        this.task = dataa;
        this.dialogTitle =  this.task.NomTask;
        const T= {
           _id:this.task._id,
           NomTask: this.task.NomTask,
          description: this.task.description,
          startDate : this.task.startDate,
          FinishDate : this.task.FinishDate,
          statut : this.task.statut ,
          priority : this.task.priority  ,
          employeeAffected : this.user._id ,
    
        };
/*     console.log(TSansU) */
    this.taskForm.patchValue(T);

      })

    } else {
      this.dialogTitle = 'New task';

    }
  

  }


  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      NomTask: ['', [Validators.required]],
      priority: [''],
      startDate: ['', [Validators.required]],
      FinishDate: ['', [Validators.required]],
      statut: [''],
       description: ['', [Validators.required]],
       employeeAffected:['', [Validators.required]],
       projectId: [this.data.idProject],
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
  if(this.data.taskId){
    this.updateT()
    Object.assign(this.data.task, this.taskForm.value);
  }else{
    this.estimatesService.createTask2(this.taskForm.getRawValue()).subscribe((newTask) => {

this.data.tasks.push(newTask)

this.dialogRef.close(this.data.tasks);
    });
  }
   }
  updateT() {
    const updatedValues = {
      _id: this.taskForm.value._id,
      NomTask: this.taskForm.value.NomTask,
      description: this.taskForm.value.description,
      startDate:  this.taskForm.value.startDate,// Converts to string in specified format
      FinishDate:  this.taskForm.value.FinishDate,
      statut: this.taskForm.value.statut,
      priority: this.taskForm.value.priority,
    
  
      // Incluez 'f' si vous ne le mettez pas à jour ici
    };
  
    this.estimatesService.updateTask(this.data.taskId, updatedValues).subscribe(() => {


    });

  }
}
