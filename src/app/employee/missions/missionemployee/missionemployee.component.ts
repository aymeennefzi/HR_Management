import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter }  from '../../../shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '../../../shared';
import { formatDate, NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Mission } from '@core/models/mission';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
// import { FormDialogComponent } from 'app/calendar/dialogs/form-dialog/form-dialog.component';
import { MissionemployeeService } from './missionemployee.service';
import { FormDialogComponent } from 'app/admin/payment-policy/form-dialog/form-dialog.component';
import { DeleteComponent } from 'app/client/missions/mymissions/dialogs/delete/delete.component';

@Component({
  selector: 'app-missionemployee',
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
    DatePipe,CommonModule
  ],
  templateUrl: './missionemployee.component.html',
  styleUrl: './missionemployee.component.scss'
})
export class MissionemployeeComponent  extends UnsubscribeOnDestroyAdapter
implements OnInit {

  displayedColumns = [
    'select',
    'name',
    'description',
    'status',
    'startDate',
    'endDate',

  ];
  exampleDatabase?: MissionemployeeService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Mission>(true, []);
  index?: string;
  id?: string;
  mission?: Mission;
  constructor(
    public httpClient: HttpClient,
    public CookieService:CookieService,
    public dialog: MatDialog,
    public missionsService:MissionemployeeService,
    private snackBar: MatSnackBar,
    private r:Router
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
  route(id:string){
    this.r.navigate(['admin/mission/assignusertomission/'+id])
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
        missions: this.mission,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.exampleDatabase?.dataChange.value.unshift(
          this.missionsService.getDialogData()
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
  editCall(row: Mission) {
    
    this.id = row._id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
     mission: row,
      id:row._id,
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
            this.missionsService.getDialogData();
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
    });  }
  deleteItem(i: string, row: Mission) {
    this.index = i;
    this.id = row._id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
  
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: '270px',
      width: '300px',
      data: { id: row._id, title: row.title, description: row.description, status: row.status, startdate: row.startDate, enddate: row.endDate },
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
      let selectedMissionIds;
      selectedMissionIds = this.selection.selected.map(item => item._id);
      const totalSelect = selectedMissionIds.length;
  
      if (totalSelect > 0) {
        this.missionsService.deleteMultipleMissions(selectedMissionIds).subscribe(
          () => {
            // Suppression réussie, effectuez les actions nécessaires
            this.selection.clear();
            this.refreshTable();
          },
          (error) => {
            // Gérez les erreurs de suppression
            console.error('Erreur lors de la suppression des missions:', error);
          }
        );
      }
  }
  public loadData() {
    this.exampleDatabase = new MissionemployeeService(this.httpClient, this.CookieService);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
  
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  
    // Appel à getAllMissionse après initialisation de la source de données
    this.exampleDatabase.getAllMissionse().subscribe((missions: Mission[]) => {
      // Mettez à jour les données de votre composant
      // Par exemple, vous pouvez affecter les données à votre source de données
      this.dataSource.data = missions;
    
    });
  }
  
  
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Title: x.title,
        Description: x.description,
        Status: x.status,
        'Start Date': formatDate(new Date(x.startDate), 'yyyy-MM-dd', 'en') || '',
        'End Date': formatDate(new Date(x.endDate), 'yyyy-MM-dd', 'en') || '',
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
  onContextMenu(event: MouseEvent, item: Mission) {
  }
  }
  export class ExampleDataSource extends DataSource<Mission> {
  filterChange = new BehaviorSubject('');
  private _data: Mission[] = [];

  // Accesseur pour obtenir les données
  get data(): Mission[] {
    return this._data;
  }

  // Accesseur pour définir les données
  set data(data: Mission[]) {
    this._data = data;
  }
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Mission[] = [];
  renderedData: Mission[] = [];
  constructor(
    public exampleDatabase: MissionemployeeService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  // connect(): Observable<Mission[]> {
  //   // Listen for any changes in the base data, sorting, filtering, or pagination
  //   const displayDataChanges = [
  //     this.exampleDatabase.dataChange,
  //     this._sort.sortChange,
  //     this.filterChange,
  //     this.paginator.page,
  //   ];
  //   //  this.exampleDatabase.getAllMissionse();
  //   this.exampleDatabase.getAllMissionse().subscribe((missions: Mission[]) => {
  //     console.log('Missions reçues : ', missions);
  //   });
    
  //    console.log('ubs',this.exampleDatabase.getAllMissionse())
  //   return merge(...displayDataChanges).pipe(
  //     map(() => {
  //       // Filter data
  //       this.filteredData = this.exampleDatabase.data
  //         .slice()
  //         .filter((missions: Mission) => {
  //           const searchStr = (
  //             missions.title +
  //             missions.description +
  //             missions.status +
  //             missions.startDate +
  //             missions.endDate
  //           ).toLowerCase();
  //           return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
  //         });
  //       const sortedData = this.sortData(this.filteredData.slice());
  //       const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //       this.renderedData = sortedData.splice(
  //         startIndex,
  //         this.paginator.pageSize
  //       );
  //       return this.renderedData;
  //     })
  //   );
  // }
  connect(): Observable<Mission[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    
    // Fetch missions from the database
    this.exampleDatabase.getAllMissionse().subscribe((missions: Mission[]) => {

      // Here you can update the data in this.exampleDatabase.data if needed
    });
    
    // Merge all observables and handle data changes
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          ? this.exampleDatabase.data
              .slice()
              .filter((missions: Mission) => {
                const searchStr = (
                  missions.title +
                  missions.description +
                  missions.status +
                  missions.startDate +
                  missions.endDate
                ).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
              })
          : [];
        
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
  }
  sortData(data: Mission[]): Mission[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: string | undefined = '';
      let propertyB: string | undefined = '';
      switch (this._sort.active) {
        case 'id':
          propertyA = a._id ? a._id.toString() : undefined;
          propertyB = b._id ? b._id.toString() : undefined;
          break;
        case 'name':
          [propertyA, propertyB] = [a.title, b.title];
          break;
        case 'description':
          [propertyA, propertyB] = [a.description, b.description];
          break;
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case 'startDate':
          [propertyA, propertyB] = [a.startDate, b.startDate];
          break;
        case 'endDate':
          [propertyA, propertyB] = [a.endDate, b.endDate];
          break;
      }
  
      // Vérifiez si propertyA et propertyB sont définis
      if (propertyA !== undefined && propertyB !== undefined) {
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  
        // Si l'une des valeurs est indéfinie, placer l'élément à la fin
        if (propertyA === undefined || propertyB === undefined) {
          return propertyA === undefined ? 1 : -1;
        }
  
        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
      } else {
        // Si l'une des valeurs est indéfinie, placer l'élément à la fin
        return propertyA === undefined ? 1 : -1;
      }
    });
  }  }