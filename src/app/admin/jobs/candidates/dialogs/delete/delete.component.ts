import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CandidatesService } from '../../candidates.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  title: string;
  email: string;
  name: string;
  jobId:string
}

@Component({
    selector: 'app-delete:not(f)',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
})
export class DeleteDialogComponent {
  jobId!:string
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public candidatesService: CandidatesService
  ) {
    this.jobId = data.jobId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // confirmDelete(): void {
  //   this.candidatesService.deleteCandidates(this.data.id);
  // }
  confirmDelete(jobId: string): void {
    this.candidatesService.deleteCandidate(jobId).subscribe(
      () => {
        // Gérer la suppression réussie
        console.log('Job deleted successfully');
        // Rafraîchir la liste des jobs si nécessaire
      },
      (error) => {
        // Gérer les erreurs de suppression
        console.error('Error deleting job:', error);
      }
    );
  }
}
