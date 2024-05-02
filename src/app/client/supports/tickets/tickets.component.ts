import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialog/delete/delete.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Tickets } from './tickets.model';
import { TicketsService } from './tickets.service';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate, NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
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
    MatPaginatorModule,
    DatePipe,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    CKEditorModule,
    ReactiveFormsModule

  ],
 
})
export class TicketsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{myForm!: FormGroup;
  private apiUrl = 'http://localhost:5000';
  public Editor: any = ClassicEditor;
  private authToken!: string; 
  filename!: string;
  constructor(private http: HttpClient, private fb: FormBuilder,private cookieService: CookieService) {
    super();
    this.retrieveUserData();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      employee_name: ['', Validators.required],
      date: ['', Validators.required],
      client: ['', Validators.required],
      employee_Email:['', Validators.required],
      comments: ['', Validators.required]
    });
  }


  
  
  
  generatePDF(): void {
    const formData = this.myForm.value;
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment générer le rapport?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generateReport(formData).subscribe(response => {
          Swal.fire('Succès', 'Le rapport a été généré avec succès!', 'success');
          const employeeNameControl = this.myForm.get(['employee_name']);
        const employeeNameValue = employeeNameControl?.value; 
        const filename = employeeNameValue + '_report.pdf';
        console.log('filename', filename); 
        this.downloadReport(filename).subscribe(blob => {
          this.saveFile(blob, filename);
        });
      }, error => {
        Swal.fire('Erreur', 'Une erreur s\'est produite lors de la génération du rapport.', 'error');
      });
    }
  });
}
  
  generateReport(data: any): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.retrieveUserData()
    });

    return this.http.post(`${this.apiUrl}/generate-report`, data, { headers: headers, withCredentials: true });
}
saveFile(blob: Blob, filename: string): void {
 
  const url = window.URL.createObjectURL(blob);

  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

 
  document.body.appendChild(a);

  
  a.click();

  
  document.body.removeChild(a);

 
  window.URL.revokeObjectURL(url);
}
  
downloadReport(filename: string): Observable<Blob> {
  const authToken = this.retrieveUserData();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  });

  return this.http.get(`http://localhost:5000/download-report?filename=${filename}`, { headers: headers, responseType: 'blob' });
}
  
  private retrieveUserData() {
    const cookieData = this.cookieService.get('user_data');
    if (cookieData) {
      try {
        const userData = JSON.parse(cookieData);
        this.authToken = userData.token; 
      } catch (error) {
        console.error('Error decoding cookie:', error);
      }
    } else {
      console.error('Cookie "user_data" is not set');
    }
  }
}

