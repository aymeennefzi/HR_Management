import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeavesService } from './leaves.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Leaves, User } from './leaves.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormComponent } from './form/form.component';
import { DeleteComponent } from './delete/delete.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate, NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
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
    MatMenuModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
  ],
})
export class LeaveRequestsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  filterToggle = false;
  displayedColumns = [
    'select',
    'img',
    'name',
    'type',
    'from',
    'endTime',
    'leaveTo',
    'numOfDays',
    'status',
    'reason',
    'actions',
  ];
  exampleDatabase?: LeavesService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Leaves>(true, []);
  id?: string;
  leaves?: Leaves;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public leavesService: LeavesService,
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
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        leaves: this.leaves,
        action: 'add',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.exampleDatabase?.dataChange.value.unshift(
          this.leavesService.getDialogData()
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
  detailsCall(row: Leaves) {
    this.dialog.open(FormComponent, {
      data: {
        leaves: row,
        action: 'details',
      },
      height: '85%',
      width: '45%',
    });
  }
  toggleStar(row: Leaves) {
  }
  editCall(row: Leaves) {
    this.id = row._id;
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        leaves: row,
        action: 'edit',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x._id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex !== undefined) {
          if (this.exampleDatabase !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.exampleDatabase!.dataChange.value[foundIndex] =
              this.leavesService.getDialogData();
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
      }
    });
  }

  accepterDemande(id: string): void {
    this.leavesService.accepterDemandeConge(id).subscribe(
      (leave: Leaves) => {
      },
    );
  }
  refuserDemandeConge(id: string): void {
    this.leavesService.refuserDemandeConge(id).subscribe(
      (leave: Leaves) => {
      },
    );
  }
  deleteItem(row: Leaves) {
    this.id = row._id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: '270px',
      width: '330px',
      data: row,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x._id === this.id
        );
        if (foundIndex !== undefined && this.exampleDatabase) {
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
    const numRows = this.dataSource?.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource?.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index = this.dataSource?.renderedData.findIndex((d) => d === item);
      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<Leaves>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.exampleDatabase = new LeavesService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort,
      this.leavesService   
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
}
export class ExampleDataSource extends DataSource<Leaves> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Leaves[] = [];
  renderedData: Leaves[] = [];
  constructor(
    public exampleDatabase: LeavesService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public leaveS : LeavesService
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  connect(): Observable<Leaves[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    return merge(...displayDataChanges).pipe(
      switchMap(() => {
        // Call the service to fetch the data
        return this.leaveS.getAllUserswithconge();
      }),
      map((data: User[]) => {
        // Flatten the data and include the user name in each leave
        const leaves: Leaves[] = [];
        data.forEach(user => {
          const id = user._id;
          const userName = user.name;
          user.leaves.forEach(leave => {
            leave.userName = userName; // Ajouter la propriété userName à chaque congé
            leaves.push(leave);
          });
        });
        // Filter data
        this.filteredData = leaves        
          .slice()
          .filter((leave: Leaves) => {
            const searchStr = (
              leave.startDate +
              leave.startTime +
              leave.endDate +
              leave.endTime +
              leave.leaveType +
              leave.status +
              leave.reason
            ).toLowerCase();
            return searchStr.includes(this.filter.toLowerCase());
          });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.slice(startIndex, startIndex + this.paginator.pageSize);

        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Leaves[]): Leaves[] {
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
        case 'startDate':
          [propertyA, propertyB] = [a.startDate, b.startDate];
          break;
        case 'leaveType':
          [propertyA, propertyB] = [a.leaveType, b.leaveType];
          break;
        case 'leaveTo':
          [propertyA, propertyB] = [a.endDate, b.endDate];
          break;
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case 'reason':
          [propertyA, propertyB] = [a.reason, b.reason];
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
