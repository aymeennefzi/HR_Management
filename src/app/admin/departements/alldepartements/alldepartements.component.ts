import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { EmployeesService } from './departement.service';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Departement } from './departement.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import { DeleteDialogComponent } from 'app/admin/leads/dialogs/delete/delete.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alldepartements',
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
    DatePipe,
    FormsModule,
    CommonModule
  ],
  templateUrl: './alldepartements.component.html',
  styleUrl: './alldepartements.component.scss'
})
// export class AlldepartementsComponent {

// }
export class AlldepartementsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'select',
    
    'name',
    'description',
    'totalEmployees',
    'vacantPositions',
    'recruitmentNeeds',
    'budgetAllocated',
    'salaryExpenditure',
    'trainingExpenditure',
    'actions'
  ];
  searchName!: string;
  exampleDatabase?: EmployeesService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Departement>(true, []);
  index?: number;
  id?: string;
  employees?: Departement;
  heros?: Departement[];
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public employeesService: EmployeesService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        employees: this.employees,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.exampleDatabase?.dataChange.value.unshift(
          this.employeesService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  editCall(row: Departement) {
    this.id = row._id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        // departement: row,
        id: row._id,
        action: 'edit',
        
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x._id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex !== undefined && this.exampleDatabase !== undefined) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.employeesService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }
 


  deleteItem(i: number, row: Departement) {
    this.index = i;
    this.id = row._id;
    console.log('ID du département :', this.id);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '270px',
      width: '300px',
      // data: row,
     data: {
        // departement: row,
        id: row._id,
        name: row.name, // Ajoutez cette ligne pour passer le nom du département
    description: row.description,
        action: 'trash-2',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x._id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex !== undefined && this.exampleDatabase !== undefined) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
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
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);

      this.refreshTable();
      this.selection = new SelectionModel<Departement>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
 
  
  public loadData() {
    this.exampleDatabase = new EmployeesService(this.httpClient);
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
  // public loadData() {
  //   this.exampleDatabase = new EmployeesService(this.httpClient);
  //   this.dataSource = new ExampleDataSource(
  //     this.exampleDatabase,
  //     this.paginator,
  //     this.sort
  //   );
  
  //   // Rafraîchir les données après une suppression réussie
  //   this.subs.sink = this.exampleDatabase.deleteSuccess.subscribe(() => {
  //     // Recharger les données
  //     this.dataSource = new ExampleDataSource(
  //       this.exampleDatabase,
  //       this.paginator,
  //       this.sort
  //     );
  //   });
  
  //   this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
  //     () => {
  //       if (!this.dataSource) {
  //         return;
  //       }
  //       this.dataSource.filter = this.filter.nativeElement.value;
  //     }
  //   );
  // }
  
  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Name: x.name,
        Description: x.description,
        totalEmployees: x.totalEmployees,
      
        vacantPositions: x.vacantPositions,
        recruitmentNeeds: x.recruitmentNeeds,
        budgetAllocated: x.budgetAllocated,
        salaryExpenditure: x.salaryExpenditure,
        trainingExpenditure: x.trainingExpenditure

      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: Departement) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
export class ExampleDataSource extends DataSource<Departement> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Departement[] = [];
  renderedData: Departement[] = [];
  constructor(
    public exampleDatabase: EmployeesService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Departement[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllEmployeess();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((employees: Departement) => {
            const searchStr = (
              employees.name +
              employees.description +
              employees.totalEmployees +
              employees.vacantPositions +
              employees.recruitmentNeeds +
              employees.budgetAllocated +
              employees.salaryExpenditure +
              employees.trainingExpenditure
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
    // disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Departement[]): Departement[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a._id, b._id];
          break;
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'description':
          [propertyA, propertyB] = [a.description, b.description];
          break;
        case 'totalEmployees':
          [propertyA, propertyB] = [a.totalEmployees, b.totalEmployees];
          break;
        case 'vacantPositions':
          [propertyA, propertyB] = [a.vacantPositions, b.vacantPositions];
          break;
          case 'recruitmentNeeds':
            [propertyA, propertyB] = [a.recruitmentNeeds, b.recruitmentNeeds];
            break;
        case 'budgetAllocated':
          [propertyA, propertyB] = [a.budgetAllocated, b.budgetAllocated];
          break;
          case 'salaryExpenditure':
          [propertyA, propertyB] = [a.salaryExpenditure, b.salaryExpenditure];
          break;
          case 'trainingExpenditure':
          [propertyA, propertyB] = [a.trainingExpenditure, b.trainingExpenditure];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}

