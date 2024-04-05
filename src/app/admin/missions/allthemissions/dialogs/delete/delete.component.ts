import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'app/admin/leads/dialogs/delete/delete.component';
import { TheMissionService } from '../../themissions.service';
import { MatButtonModule } from '@angular/material/button';
export interface DialogData {
  id: string;
 title: string;
 description: string;
 status : string;
 startdate:string;
 enddate:string;
}

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public MissionService: TheMissionService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
 async  confirmDelete():  Promise<void> {
    console.log(this.data.id);
   await  this.MissionService.deleteMission(this.data.id).subscribe();
  }

}
