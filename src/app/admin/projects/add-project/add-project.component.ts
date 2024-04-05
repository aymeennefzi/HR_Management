import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { NotifcationServiceService } from 'app/layout/header/Notifcation.service';
import { ProjectService } from '../all-projects/core/project.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
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
    MatButtonModule,
  ],
})
export class AddprojectsComponent {
  projectForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  iduser!:any
  public Editor: any = ClassicEditor;
  teamList: string[] = [
    'Sarah Smith',
    'John Deo',
    'Pankaj Patel',
    'Pooja Sharma',
  ];
  constructor(private fb:UntypedFormBuilder, private projectService: ProjectService,private r:Router,private cookieService:CookieService) {
    this.retrieveUserData()
    this.projectForm = this.fb.group({
    
      NomProject: ['', [Validators.required]],
      priority: ['', [Validators.required]],
   /*    NomChefProjet: ['', [Validators.required]], */
      StartDate: ['', [Validators.required]],
      FinishDate: ['', [Validators.required]],
      team: [''],
      statut: [''],
       description: ['', [Validators.required]],
       UserProjectsId: [ this.iduser ],
       type: ['', [Validators.required]],
    });
    
  }

  retrieveUserData() {

    const cookieData = this.cookieService.get('user_data');
    if (cookieData) {
      try {
        const userData = JSON.parse(cookieData);
        this.iduser = userData.user.id; // Store user data in the component's variable
      
      } catch (error) {
        console.error('Error decoding cookie:', error);
      }
    } else {
      console.error('Cookie "user_data" is not set');
    }
  }
  addProject(){
    const formattedValues = {
      ...this.projectForm.value,
      StartDate: moment(this.projectForm.value.StartDate).format('DD-MM-YYYY'),
      FinishDate: moment(this.projectForm.value.FinishDate).format('DD-MM-YYYY'),
      priority: +this.projectForm.value.priority,
      statut: +this.projectForm.value.statut,

 
    };
  
    // Convert priority to a number if it's not already
  
    console.log('jj',formattedValues);
    this.projectService.createProject(formattedValues).subscribe(
      () => {
    
        this.r.navigate(['admin/projects/allProjects']);
      }
    );
   
   }
}
