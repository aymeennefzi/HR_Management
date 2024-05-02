import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MyLeavesService } from '../../my-leaves.service';
import { MatButtonModule } from '@angular/material/button';
import { Status } from '../../my-leaves.model';
import Swal from 'sweetalert2';

export interface DialogData {
  _id: string;
  type: string;
  status: string;
  reason: string;
}

@Component({
    selector: 'app-delete:not(q)',
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
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public myLeavesService: MyLeavesService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  // confirmDelete(): void {
  //   const leave = this.data._id ; // Convertir _id en chaîne de caractères
  //   this.myLeavesService.deleteMyLeaves(leave);
  // }

confirmDelete(): void {
    const leave = this.data._id; // Convertir _id en chaîne de caractères
    const status = this.data.status;

    if (status === Status.Approved || status === Status.Declined) {
        // Afficher une alerte SweetAlert pour informer l'utilisateur que le leave ne peut pas être supprimé
        Swal.fire({
            icon: 'error',
            title: 'Unable to delete',
            text: 'Cannot delete , This leave has been processed by the administrator.',
            confirmButtonText: 'OK'
        });
        return;
    }
    // Supprimer le leave s'il n'est pas approuvé ou refusé
    this.myLeavesService.deleteMyLeaves(leave);
    Swal.fire({
      icon: 'success',
      title: 'Leave deleted',
      text: 'The leave has been successfully deleted.',
      confirmButtonText: 'OK'
  });
}

  
}
