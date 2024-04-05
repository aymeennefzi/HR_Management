import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { TheMissionService } from '../allthemissions/themissions.service';

@Component({
  selector: 'app-assign-userto-mission',
  standalone: true,
  imports: [ BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatRadioModule,
    CKEditorModule,
    FileUploadComponent,
    MatButtonModule,],
  templateUrl: './assign-userto-mission.component.html',
  styleUrl: './assign-userto-mission.component.scss'
})
export class AssignUsertoMissionComponent {
  userForm: UntypedFormGroup;
  id!:string;
  hide3 = true;
  agree3 = false;
  public Editor: any = ClassicEditor;

  constructor(private fb: UntypedFormBuilder,private actR:ActivatedRoute,   public missionsService: TheMissionService,private r:Router) {
    this.userForm = this.fb.group({
      userId: ['', [Validators.required]],
     
    });
  }
  ngOnInit(){
    this.actR.params.subscribe(params => {
      const _id = params['_id'];
  this.id=_id
    });
  }
 
  onSubmit() {
    const userId = this.userForm.value.userId;
    // Assuming `this.id` is the mission ID and `this.userForm.value` contains the user data
    this.missionsService.assignUserToMission(this.id,userId).subscribe({
      next: (response) => {
        console.log(this.id)
        console.log(this.userForm.value)
        // Handle the response if needed, for example, logging it or setting some state
        console.log('Mission assignment successful', response);
        // Navigate to the 'all missions' page upon successful mission assignment
        this.r.navigate(['admin/mission/allmissions']);
      },
      error: (error) => {
        // Handle any errors that occur during the subscription
        console.error('Error during mission assignment', error);
      }
    });
  }
}
