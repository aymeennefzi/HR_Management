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
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormComponent } from './form/form.component';
import { DeleteComponent } from './delete/delete.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate, NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { WebSocketServiceService } from '../web-socket-service.service';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';

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
    SocketIoModule,
    CommonModule,
    FormsModule
  ],
})
export class LeaveRequestsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  filterToggle = false;
  displayedColumns = [
    // 'select',
    'profileImage',
    'name',
    'type',
    'from',
    'endTime',
    'leaveTo',
    'numOfDays',
    'status',
    'reason',
     //'actions',
  ];
  exampleDatabase?: LeavesService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Leaves>(true, []);
  id?: string;
  leaves?: Leaves;
  receivedMessage !: string;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public leavesService: LeavesService,
    private snackBar: MatSnackBar,
    private webS: WebSocketServiceService
  ) {
    super();
    
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  messageToSend!: string;
  private messageSubscription!: Subscription;

  ngOnInit() {
    this.loadData();
    
  }
 
  refresh() {
    this.loadData();

  }
  toggleStar(row: Leaves) {
  }

  private socket !: Socket;
  message: string = '';

  accepterDemande(id: string): void {
    this.leavesService.accepterDemandeConge(id).subscribe(
      (leave: Leaves) => {
        console.log(leave);
        const id1 ="660f83cd8d1bfc8173f09d51";
        const message = 'Votre demande de congé a été acceptée.';
      },
    );
  }
  sendMessage() {
    if (this.message.trim() !== '') {
      this.webS.sendMessage(this.message);
      this.message = '';
    }
  }
 
  refuserDemandeConge(id: string): void {
    this.leavesService.refuserDemandeConge(id).subscribe(
      (leave: Leaves) => {
      },
    );
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
        return this.leaveS.getAllUserswithconge();
      }),
      map((data: User[]) => {
        // Flatten the data and include the user name in each leave
        console.log("reeee" , data)
        const leaves: Leaves[] = [];
        data.forEach(user => {
          const id = user._id;
          const userName = user.name;
          const img =user.image
          user.leaves.forEach(leave => {
            leave.userName = userName; // Ajouter la propriété userName à chaque congé
           leave.image = img;
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
