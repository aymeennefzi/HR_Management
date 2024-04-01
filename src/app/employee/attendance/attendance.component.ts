import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormComponent } from './form/form.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Attendances } from './attendance.model';
import { AttendancesService } from './attendance.service';
import { Direction } from '@angular/cdk/bidi';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TestComponent } from "../test/test.component";
import { MatIconModule } from '@angular/material/icon';
import { FormDialogComponent } from '../my-leaves/dialogs/form-dialog/form-dialog.component';
import { MyLeavesService } from '../my-leaves/my-leaves.service';

@Component({
    selector: 'app-attendances',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.scss'],
    standalone: true,
    imports: [
        BreadcrumbComponent,
        MatTableModule,
        MatSortModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        DatePipe,
        TestComponent,
        MatIconModule
    ]
})
export class AttendancesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  filterToggle = false;
  displayedColumns = [
    'date',
    // 'check_in',
    'status',
    "etat",
    // 'break',
    // 'check_out',
    // 'hours',
    // 'status',
  ];
  attendanceListe:Attendances[]=[];
  exampleDatabase?: AttendancesService | null;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Attendances>(true, []);
  id?: number;
  attendances?: Attendances | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public attendancesService: AttendancesService,
    public myLeavesService: MyLeavesService,
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
    // this.loadData();
    this.getattendance();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        myLeaves: this.attendances,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.attendancesService.getDialogData()
        );
        this.refresh();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(FormComponent, {
    //   data: {
    //     myLeaves: this.attendances,
    //     action: 'add',
    //   },
    //   direction: tempDirection,
    // });
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
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  refresh() {
    // this.loadData();
  }
  getattendance(){
    this.attendancesService.getAttendance().subscribe({
      next:(data )=>{
        this.attendanceListe=data as Attendances[] ;
        console.log(this.attendanceListe)
      },
      error:()=>{

      }
    })
  }
  detailsCall(row: Attendances) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(FormComponent, {
      data: {
        attendances: row,
        action: 'details',
      },
      direction: tempDirection,
      height: '85%',
      width: '35%',
    });
  }

  // public loadData() {
  //   this.exampleDatabase = new AttendancesService(this.httpClient);
  //   this.dataSource = new ExampleDataSource(
  //     this.exampleDatabase,
  //     this.paginator,
  //     this.sort
  //   );
  //   this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
  //     () => {
  //       if (!this.dataSource) {
  //         return;
  //       }
  //       this.dataSource.filter = this.filter.nativeElement.value;
  //     }
  //   );
  // }
}
export class ExampleDataSource extends DataSource<Attendances> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Attendances[] = [];
  renderedData: Attendances[] = [];
  constructor(
    public exampleDatabase: AttendancesService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Attendances[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllAttendancess();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((attendances: Attendances) => {
            const searchStr = (
              attendances.date +
              // attendances.check_in +
              // attendances.break +
              // attendances.check_out +
              // attendances.hours +
              attendances.status
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
  sortData(data: Attendances[]): Attendances[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'date':
          // [propertyA, propertyB] = [a.date, b.date];
          break;
        // case 'check_in':
        //   [propertyA, propertyB] = [a.check_in, b.check_in];
        //   break;
        // case 'break':
        //   [propertyA, propertyB] = [a.break, b.break];
        //   break;
        // case 'check_out':
        //   [propertyA, propertyB] = [a.check_out, b.check_out];
        //   break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
