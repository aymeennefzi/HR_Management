import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeesService } from '../../departement.service';
export interface DialogData {
  id: string;
  name: string;
  description: string;
 
}
@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteDialogComponent {
  id!:string
  items: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public employeesService: EmployeesService
  ) {
    this.id = data.id;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(id: string): void {
    this.employeesService.deleteDepartment(id).subscribe(
      () => {
        // Supprimer l'élément du tableau local
        // this.items = this.items.filter(item => item.id !== id);
        console.log('Element supprimé avec succès');
  
        // Mise à jour du stockage local (localStorage) pour refléter les changements
        // localStorage.setItem('items', JSON.stringify(this.items));
      },
      error => {
        console.error('Erreur lors de la suppression de l\'élément:', error);
      }
    );
  }
  // onDeleteJob(jobId: string): void {
  //   this.jobsListService.deleteJob(jobId).subscribe(
  //     () => {
  //       // Gérer la suppression réussie
  //       console.log('Job deleted successfully');
  //       // Rafraîchir la liste des jobs si nécessaire
  //     },
  //     (error) => {
  //       // Gérer les erreurs de suppression
  //       console.error('Error deleting job:', error);
  //     }
  //   );
  // }
}
