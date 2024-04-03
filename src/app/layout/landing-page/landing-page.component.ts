import { Component, NgModule } from '@angular/core';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { ServiceComponentComponent } from './service-component/service-component.component';
import { JobsListService } from 'app/admin/jobs/jobs-list/jobs-list.service';
import { JobsList } from 'app/admin/jobs/jobs-list/jobs-list.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormdialogComponentComponent } from './formdialog-component/formdialog-component.component';

const routes: Routes = [
 
  { path: 'services', component:ServiceComponentComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirection par défaut vers /home
];
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,MatIconModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  template: `
    <div>
      <router-outlet></router-outlet>
    </div>
  `
})


export class LandingPageComponent {
  job!:JobsList;
  jobId!: string;

  jobsList: JobsList[] = [];

  constructor(private router: Router,private jobservice:JobsListService,public dialog: MatDialog) { }
  ngOnInit(): void {
    // Dans ngOnInit, récupérez la liste des emplois depuis votre service
    this.jobservice.getJobs().subscribe(
      (jobs: any[]) => {
        this.jobsList = jobs; // Assurez-vous que votre service renvoie la liste des emplois
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }
  openDialog(jobId: string, jobTitle: string,event: MouseEvent): void {
    // Empêcher la redirection vers l'authentification si le clic provient du bouton "Read More"
    event.preventDefault();
    console.log('ID du job:', jobId);
    console.log('Titre du job:', jobTitle);
    // Ouvrir le dialogue
    const dialogRef = this.dialog.open(FormdialogComponentComponent, {
      width: '750px', // Largeur spécifique du dialog
      height: '400px', // Hauteur spécifique du dialog
      panelClass: 'dialog-container',
       // Définissez la largeur du dialogue selon vos besoins
      data: { jobId: jobId ,jobTitle: jobTitle} // Passez l'ID de l'emploi au dialogue
      
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogue fermé');
      // Traitez ici toute logique après la fermeture du dialogue si nécessaire
    });
  }
  
  
  
}
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
