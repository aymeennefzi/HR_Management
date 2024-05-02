import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterOutlet } from '@angular/router';
import { CandidatesService } from 'app/admin/jobs/candidates/candidates.service';
import { CVData } from './service-component';


@Component({
  selector: 'app-service-component',
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
        MatDialogClose,
        CommonModule,
        RouterOutlet
  ],
  templateUrl: './service-component.component.html',
  styleUrl: './service-component.component.scss'
})
export class ServiceComponentComponent  {
  pdfBlob: Blob | null = null;
  dialogTitle!: string;
  selectedImage: File | null = null;
  competences: string[] = [];
    nouvelleCompetence: string = '';

  constructor(public candidatesService: CandidatesService,
    public dialogRef: MatDialogRef<ServiceComponentComponent>,
  ) { }
  cvData:CVData = {
    nom: '',
    job: '',
    phone1: '',
    Adresse: '',
    email: '',
    educations: '',
    competences: '',
    profile:''
};
ajouterCompetence() {
  if (this.nouvelleCompetence.trim() !== '') {
      this.competences.push(this.nouvelleCompetence);
      this.nouvelleCompetence = '';
  }
}
  
generatePdf(): void {
  console.log('Données du CV avant génération PDF : ', this.cvData);
  const imageUrl = this.selectedImage ? URL.createObjectURL(this.selectedImage) : '';
  console.log('Image URL:', imageUrl);
  this.candidatesService.generateCv({...this.cvData, selectedImage: imageUrl}).subscribe((pdfBlob: Blob) => {
    console.log('PDF généré avec succès : ', pdfBlob);
    this.pdfBlob = pdfBlob;
  }, (error : any) => {
    console.error('Erreur lors de la génération PDF : ', error);
  });
}
  
  downloadPdf(): void {
    if (this.pdfBlob) {
      // Créer une URL à partir du Blob
      const pdfUrl = window.URL.createObjectURL(this.pdfBlob);
      // Créer un lien temporaire
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'cv.pdf';
      // Ajouter le lien à la page et cliquer dessus pour démarrer le téléchargement
      document.body.appendChild(link);
      link.click();
      // Nettoyer après le téléchargement
      document.body.removeChild(link);
    }
  }
  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedImage = fileList[0];
    }
}}