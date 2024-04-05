import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TypeStatutProjet } from '../core/project.model';
import { ProjectService } from '../core/project.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { TruncatePipe, PluralPipe, StripHtmlPipe } from '../core/pipes';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '@core';


@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    standalone: true,
    imports: [
      StripHtmlPipe,
        CdkDropList,
        CdkDrag,
        MatProgressBarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        DatePipe,
        KeyValuePipe,
        TruncatePipe,
        PluralPipe,
    ],
})
export class BoardComponent implements OnInit {
  user!:any
  projects: any[] = [];
  userfinded: any = { projects: [] };

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private r:Router,
    private cookieService:CookieService,
    private auth:AuthService
 
  ) {
  
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
        this.auth.getUserById(this.user.id).subscribe((data)=>{this.userfinded=data;
          console.log('dd',this.userfinded.projects)
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

  public newProjectDialog(): void {
    this.dialogOpen('Create new project', null,null,this.userfinded.projects,this.user.id);
  }

  public editProjectDialog(id: string,projectt:any): void {
    this.dialogOpen('Edit project', id,projectt,null,this.user.id);
  }
  public route(id: string): void {
    this.r.navigate(['admin/projects/estimates', id]);
  }
  
  
  private dialogOpen(title: string, projectId: string| null ,projectt:any| null,projects:any[]| null,idUser:any| null): void {
    let tempDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
    this.dialog.open(ProjectDialogComponent, {
      height: '85%',
      width: '55%',
      autoFocus: true,
      data: {
        title,
        projectId, // projectId can now be a string or null
        projectt,
        projects,
        idUser
      },
      direction: tempDirection,
    });
  }
  
  convertDate(dateStr: string): string {
    return moment(dateStr, 'DD-MM-YYYY').format('YYYY-MM-DD');
  }
  
  
}
