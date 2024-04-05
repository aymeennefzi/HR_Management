import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { JobsListService } from '../../jobs-list.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  title: string;
  status: string;
  description: string;
  jobId:string
}

@Component({
    selector: 'app-delete:not(g)',
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
  jobId!: string;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public jobsListService: JobsListService
  ) {
    this.jobId = data.jobId;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // confirmDelete(): void {
  //   this.jobsListService.deleteJobsList(this.data.id);
  // }
  onDeleteJob(jobId: string): void {
    this.jobsListService.deleteJob(jobId).subscribe(
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
