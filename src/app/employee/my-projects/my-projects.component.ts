import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MyProjects } from './my-projects.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormComponent } from './form/form.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProjectService } from 'app/admin/projects/all-projects/core/project.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '@core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { PluralPipe, StripHtmlPipe, TruncatePipe } from 'app/admin/projects/all-projects/core/pipes';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    CdkDropList,
    CdkDrag,
    KeyValuePipe,
    TruncatePipe,
    PluralPipe,
    StripHtmlPipe,
  ],
})
export class MyProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
    user!:any
    projects: any[] = [];
    userfinded: any ;
  
    constructor(
      private projectService: ProjectService,
      private dialog: MatDialog,
      private r:Router,
      private cookieService:CookieService,
      private auth:AuthService
   
    ) {
      super();
    }
  
    public ngOnInit(): void {
   this.retrieveUserData()
      
    }
  
    retrieveUserData() {
      const cookieData = this.cookieService.get('user_data');
      if (cookieData) {
        try {
          const userData = JSON.parse(cookieData);
          this.user = userData.user; // Store user data in the component's variable
          this.auth.getUserById(this.user.id).subscribe((userData) => {
            this.userfinded = userData;
            console.log('User data:', this.userfinded);
            
            if (this.userfinded?.tasks && Array.isArray(this.userfinded.tasks)) {
              // Assuming tasks is an array, we extract the _id of each task
              const taskIds = this.userfinded.tasks.map((task: { _id: any; }) => task._id);
              
              this.projectService.getProjectsByTaskIds(taskIds).subscribe((projectsData) => {
                this.projects = projectsData;
                console.log('Projects:', this.projects);
              }, (error) => {
                // It's a good practice to handle potential errors in subscriptions
                console.error('Error fetching projects:', error);
              });
            } else {
              console.log('No tasks found for this user or tasks structure is unexpected');
            }
          }, (error) => {
            console.error('Error fetching user data:', error);
          });
          
        } catch (error) {
          console.error('Error decoding cookie:', error);
        }
      } else {
        console.error('Cookie "user_data" is not set');
      }
    }
    
  
  
    public removeProject(id: string): void {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimez-le!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.projectService.deleteProject(id).subscribe(() => {
            Swal.fire(
              'Supprimé!',
              'Votre projet a été supprimé.',
              'success'
            );
            this.ngOnInit(); // Ou une autre méthode pour actualiser la liste des projets
          }, (error) => {
            // Gérer l'erreur ici, par exemple :
            Swal.fire(
              'Erreur!',
              'La suppression du projet a échoué.',
              'error'
            );
          });
        }
      });
    }

    public route(id: string): void {
      this.r.navigate(['admin/projects/estimates', id]);
    }
    

    
    convertDate(dateStr: string): string {
      return moment(dateStr, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }
}
