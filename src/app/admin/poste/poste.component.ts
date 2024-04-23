import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, ErrorHandler, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PosteService } from './poste.service';
import { Poste, UserWithoutPost } from './Poste.model';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { BehaviorSubject, Observable, merge, map, fromEvent } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { FormDialogComponent } from './dialogs/form-dialogs/form-dialogs.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-poste',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
  MatFormField,
 MatLabel,
MatSelect,
MatOptionModule,
CommonModule,
    FormsModule,
    ReactiveFormsModule,
     ],
  templateUrl: './poste.component.html',
  styleUrl: './poste.component.scss'
})
export class PosteComponent  extends UnsubscribeOnDestroyAdapter
implements OnInit
{
 
  displayedColumns = [
    "basicSalary",
    "postName",
    "workshour",
    "assignUser",
    "actions"

  ]
  formGroup!: FormGroup;
  exampleDatabase?: PosteService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Poste>(true, []);
  index?: number;
  id?: number;
  Poste?: Poste;
  posteId!: string;
  selectedUserIds: string[] = []; // Utilisateur sélectionné
  usersWithoutPoste: any[] = [
    
  ]; 
  constructor(
    public httpClient: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public posteService: PosteService,
    private snackBar: MatSnackBar,
    private formBuider: FormBuilder
  ) {
    super();
  }
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  searchTerm: string = ''; // Variable pour stocker le terme de recherche saisi par l'utilisateur

  ngOnInit() {
    this.loadData();
    this.loadUsersWithoutPoste();
    this.formGroup = this.formBuider.group({
      selectedUserIds: [[]] // Utiliser un tableau vide comme valeur initiale
    });
   
  }
  refresh() {
    this.ngOnInit();
  }
  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        action: 'ADD',
      },
    });
    dialogRef.componentInstance.posteAdded.subscribe(() => {
      // Rafraîchir la liste des postes
      this.refreshPostList();
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
       console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);

      this.refreshTable();
      this.selection = new SelectionModel<Poste>(true, []);
    });
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }
  public loadData() {
    this.exampleDatabase = new PosteService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }
  loadUsersWithoutPoste() {
    this.posteService.getUsersWithoutPoste().subscribe(
      (users: UserWithoutPost[]) => {
        this.usersWithoutPoste = users;
        console.log('Utilisateurs sans poste :', this.usersWithoutPoste); // Ajout du console.log
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs sans poste :', error);
        // Gestion de l'erreur
      }
    );
  }
  


  // onUserSelectionChange(event: MatSelectChange) {
  //   if (event.value) {
  //     // Si event.value est défini
  //     const userIds = event.value as string[]; // Obtenir les IDs des utilisateurs sélectionnés
  //     console.log('User IDs:', userIds);

  //     // Faire ce que vous avez à faire avec les IDs sélectionnés, par exemple, les enregistrer dans selectedUserIds
  //     this.selectedUserIds = userIds;
  //   } else {
  //     console.log('Aucun utilisateur sélectionné');
  //     // Gérer le cas où aucun utilisateur n'est sélectionné, par exemple, afficher un message à l'utilisateur
  //   }
  // }
  
  onUserSelectionChange(row: Poste): void {
    if (!row.Users || row.Users.length === 0) {
        console.log('Aucun utilisateur sélectionné pour le poste avec ID', row._id);
        return;
    }

    // Vérifier les propriétés des utilisateurs dans row.Users
    console.log('Utilisateurs sélectionnés pour le poste avec ID', row._id, ':', row.Users);

    // Vérifier les IDs des utilisateurs
    const selectedUserIds = row.Users.map(user => user.id);
    console.log('Ids des Utilisateurs sélectionnés pour le poste avec ID', row._id, ':', selectedUserIds);
}
filteredPoste: any; // Vous pouvez déclarer filteredPoste avec le bon type, par exemple: Poste | undefined;

searchPoste() {
  if (this.searchTerm.trim() !== '') {
    this.posteService.getPosteByPostName(this.searchTerm).subscribe({
      next: (poste: any) => {
        this.filteredPoste = poste;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche du poste :', error);
        this.filteredPoste = undefined;
      },
    });
  } else {
    // Gérer le cas où la recherche est vide
    this.filteredPoste = undefined;
  }
}

  assignUsersToPost(row: Poste) {
    if (!row.Users || row.Users.length === 0) {
      this.snackBar.open('Veuillez sélectionner au moins un utilisateur.', 'Fermer', { duration: 2000 });
      return;
    }
    const selectedUserIds = row.Users.map(user => user.id);
    console.log('Utilisateurs sélectionnés pour le poste avec ID', row._id, ':', selectedUserIds); // Obtenir les IDs des utilisateurs sélectionnés
  console.log('selectedUserIds',selectedUserIds);
    this.posteService.assignUserToPost(selectedUserIds, row._id).subscribe(
      () => {
        this.snackBar.open('Utilisateur(s) affecté(s) avec succès au poste.', 'Fermer', { duration: 2000 });
        // Réinitialiser la liste des IDs sélectionnés après l'affectation réussie
        // this.selectedUserIds = []; // Pas besoin car nous utilisons selectedUserIds directement maintenant
        // Actualiser la liste des postes après l'affectation
        // Mettez ici le code pour rafraîchir votre liste de postes si nécessaire
      },
      (error: any) => {
        console.error('Erreur lors de l\'affectation des utilisateurs au poste :', error);
        this.snackBar.open('Une erreur est survenue lors de l\'affectation des utilisateurs au poste.', 'Fermer', { duration: 2000 });
      }
    );
  }
  deleteItem(postId: string) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce poste ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.posteService.deletePoste(postId).subscribe(
          () => {
            console.log('Poste supprimé avec succès.');
            this.refresh();
            // Supprimer l'élément de la liste locale
            // this.posteId.splice(index, 1);
          },
          error => {
            console.error('Erreur lors de la suppression du poste:', error);
            // Afficher un message d'erreur à l'utilisateur
          }
        );
      }
    });
  }
  // getPostesBySalaryRange(minSalary: number, maxSalary: number): void {
  //   this.posteService.getPosteBySalaryRange(minSalary, maxSalary)
  //     .subscribe(
  //       (data) => {
  //         this.postes = data;
  //         console.log('Postes récupérés avec succès :', this.postes);
  //       },
  //       (error) => {
  //         console.error('Erreur lors de la récupération des postes :', error);
  //       }
  //     );
  // }
  
  
  // assignUsersToPost(post: Poste) {
  //   if (this.selectedUserIds.length === 0) {
  //     this.snackBar.open('Veuillez sélectionner au moins un utilisateur.', 'Fermer', { duration: 2000 });
      
  //     return;

  //   }
    
  //   this.posteService.assignUserToPost(this.selectedUserIds, this.posteId).subscribe(
  //     () => {
  //       this.snackBar.open('Utilisateur(s) affecté(s) avec succès au poste.', 'Fermer', { duration: 2000 });
  //       // Réinitialiser la liste des IDs sélectionnés après l'affectation réussie
  //       this.selectedUserIds = [];
  //       // Actualiser la liste des postes après l'affectation
  //       // Mettez ici le code pour rafraîchir votre liste de postes si nécessaire
  //     },
  //     (error: any) => {
  //       console.log("selectedUserIds",this.selectedUserIds)
  //       console.error('Erreur lors de l\'affectation des utilisateurs au poste :', error);
  //       this.snackBar.open('Une erreur est survenue lors de l\'affectation des utilisateurs au poste.', 'Fermer', { duration: 2000 });
  //     }
  //   );
  // }

  refreshPostList() {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.posteService.getPosteByPostName(this.searchTerm).subscribe({
        next: (poste: any) => {
          this.filteredPoste = poste;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche du poste :', error);
          this.filteredPoste = undefined;
        },
      });
    } else {
      // Gérer le cas où la recherche est vide
      this.filteredPoste = undefined;
    }
  }
  
  

  editPoste(row: Poste): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        PosteId: row._id,
        action: 'EDIT', // Définir l'action sur EDIT pour la modification du poste
        poste: row // Passer les détails du poste à modifier
      }
    });

    dialogRef.componentInstance.posteAdded.subscribe(() => {
      // Rafraîchir la liste des postes après la modification
      this.refreshPostList();
    });
  }
 
    // async assignPostToUser() {
    //   try {
    //     await this.posteService.assignUserToPost( this.posteId,this.selectedUserId);
    //     console.log('Poste affecté à l\'utilisateur avec succès.');
    //   } catch (error) {
    //     console.error('Erreur lors de l\'affectation du poste à l\'utilisateur :', error);
    //   }
    //   this.dialog.closeAll();
    // }
 
 
  }
  



  export class ExampleDataSource extends DataSource<Poste> {
    filterChange = new BehaviorSubject('');
    get filter(): string {
      return this.filterChange.value;
    }
    set filter(filter: string) {
      this.filterChange.next(filter);
    }
    filteredData: Poste[] = [];
    renderedData: Poste[] = [];
    constructor(
      public exampleDatabase: PosteService,
      public paginator: MatPaginator,
      public _sort: MatSort
    ) {
      super();
      // Reset to the first page when the user changes the filter.
      this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
    }
    

    
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Poste[]> {
      // Listen for any changes in the base data, sorting, filtering, or pagination
      const displayDataChanges = [
        this.exampleDatabase.dataChange,
        //  this._sort.sortChange,
        this.filterChange,
        this.paginator.page,
      ];
      this.exampleDatabase.getAllPoste();
      return merge(...displayDataChanges).pipe(
        map(() => {
          // Filter data
          this.filteredData = this.exampleDatabase.data
            .slice()
            .filter((Poste: Poste) => {
              const searchStr = (
                Poste._id+
                Poste.BasicSalary+
                Poste.PostName+
                Poste.Workshour+
                Poste.Users
                
                
              ).toLowerCase();
              return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });
          // Sort filtered data
          const sortedData = this.sortData(this.filteredData.slice());
          // Grab the page's slice of the filtered sorted data.
          const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
          this.renderedData = sortedData.splice(
            startIndex,
            this.paginator.pageSize
          );
          return this.renderedData;
        })
      );
    }
    disconnect() {
      //disconnect
    }
    /** Returns a sorted copy of the database data. */
    sortData(data: Poste[]): Poste[] {
      if (!this._sort.active || this._sort.direction === '') {
        return data;
      }
    
      return data.sort((a, b) => {
        const isAsc = this._sort.direction === 'asc';
        switch (this._sort.active) {
          case 'BasicSalary': return this.compare(a.BasicSalary, b.BasicSalary, isAsc);
          case 'PostName': return this.compare(a.PostName, b.PostName, isAsc);
          case 'Workshour': return this.compare(a.Workshour, b.Workshour, isAsc);
                 
          default: return 0;
        }
      });
    }
   
    compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
     // Assurez-vous que le type correspond à la structure de vos utilisateurs
  
   
     
  
   
  };
  

