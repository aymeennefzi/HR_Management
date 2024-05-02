import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Candidates } from 'app/admin/jobs/candidates/candidates.model';
import { CandidatesService } from 'app/admin/jobs/candidates/candidates.service';
import { JobsList } from 'app/admin/jobs/jobs-list/jobs-list.model';
import { JobsListService } from 'app/admin/jobs/jobs-list/jobs-list.service';
import Swal from 'sweetalert2';
export interface DialogData {
  jobId: string;
  action: string;
  candidates: Candidates;
  jobTitle:string
}
@Component({
  selector: 'app-formdialog-component',
  standalone: true,
  imports: [
    MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogClose,
        CommonModule
  ],
  templateUrl: './formdialog-component.component.html',
  styleUrl: './formdialog-component.component.scss'
})
export class FormdialogComponentComponent implements OnInit {
  selectedJobTitle: string | null = null;
  openJobTitles: string[] = [];
  jobId:string
  action: string;
  dialogTitle: string;
  candidatesForm: UntypedFormGroup;
  candidates: Candidates;
  job!:JobsList;
  jobs: any[] = [];
  cvFile: File | null = null;
  contactForm!: UntypedFormGroup;
  jobTitle: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<FormdialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public candidatesService: CandidatesService,
    private fb: UntypedFormBuilder,
    private jobService: JobsListService,
    private route: ActivatedRoute
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.candidates.candidateName;
      this.candidates = data.candidates;
    } else {
      this.dialogTitle = 'New Candidates';
      const blankObject = {} as Candidates;
      this.candidates = Object.assign(new Candidates(), blankObject);
    }
    this.candidatesForm = this.createContactForm();
    this.contactForm = this.createContactForm();
    this.jobId = data.jobId;
    this.jobTitle = data.jobTitle;
    console.log('Job Title:', this.jobTitle);
  }
 
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.mobile,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('mobile')
      ? 'Not a valid mobile'
      : '';
  }
  ngOnInit(): void {
    this.candidatesForm = this.createContactForm();
    this.getJobs();
    this.contactForm = this.createContactForm(); 
    if (this.data.jobTitle && this.data.jobId) {
      this.contactForm.get('jobTitle')!.setValue(this.data.jobTitle);
      this.contactForm.get('jobId')!.setValue(this.data.jobId);
  }

  
  }
  createContactForm(): UntypedFormGroup {
    // const fileName = this.candidates.cv.split('/').pop();
    const fileName = this.candidates.cv ? this.candidates.cv.split('/').pop() : null;
    const jobTitle = this.jobs.find(job => job._id === this.candidates.jobId)?.title || null;
    return this.fb.group({
     
    
      id: [this.candidates._id],
      candidateName: [this.candidates.candidateName],
      
      email: [this.candidates.email],
      jobId: [this.candidates.jobId],
      // cv: [this.candidates.cv],
      cv: [fileName],
      // jobTitle: [jobTitle],
      jobTitle: [this.data.jobTitle],
      
     
    });
  }
  getCvPath(): string {
    // Vérifiez si le candidat a un CV et retournez le chemin approprié
    return this.candidates.cv ? `file:///${this.candidates.cv} `: ''; // Modifiez ceci pour ajuster le format du chemin si nécessaire
  }
onJobSelect(jobId: string): void {
  const selectedJob = this.jobs.find(job => job._id === jobId);
  if (selectedJob) {
      this.contactForm.get('jobId')!.setValue(selectedJob._id); // Met à jour le champ jobId dans le formulaire
      this.contactForm.get('jobTitle')!.setValue(selectedJob.title); // Met à jour le champ jobTitle dans le formulaire
  }
}
  onFileSelected(event: any) {
    this.cvFile = event.target.files[0] as File;
    // Utilisez 'controls' pour accéder aux contrôles du formulaire
    this.contactForm.controls['cv'].setValue(this.cvFile ? this.cvFile.name : '');
  }

  getJobs(): void {
    this.jobService.getJobs().subscribe(
      (jobs: any[]) => {
        // Filtrer les jobs avec le statut "Open"
        this.jobs = jobs.filter(job => job.status === 'Open');
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }
  
 
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
 
  
 
//   public confirmAdd(): void {
//     if (this.contactForm && this.contactForm.valid && this.cvFile) {
//       const jobId = this.contactForm.get('jobId')!.value;
//       console.log('Job ID:', jobId);
//       if (jobId) { // Vérifiez si l'ID du job est défini
//         const formData = new FormData();
//         formData.append('candidateName', this.contactForm.get('candidateName')!.value);
//         formData.append('email', this.contactForm.get('email')!.value);
//         formData.append('jobId', jobId);
//         formData.append('cv', this.cvFile);
//         // Ajout
//         // Appelez la méthode d'ajout du service avec les données du formulaire
//         this.candidatesService.applyforjob(formData).subscribe(
//           (response) => {
//             console.log('Application submitted successfully:', response);
//             alert('Application submitted successfully!');
//             this.dialogRef.close(true); // Fermer le dialogue après l'ajout réussi
//           },
//           (error) => {
//             console.error('Error submitting application:', error);
//             // Gérer les erreurs d'ajout
//           }
//         );
//       } else {
//         console.error('Error: Job ID is null');
//         // Gérer le cas où l'ID du job est null
//       }
//     }
// }
public confirmAdd(): void {
  if (this.contactForm && this.contactForm.valid && this.cvFile) {
    const jobId = this.contactForm.get('jobId')!.value;
    console.log('Job ID:', jobId);
    if (jobId) { // Vérifiez si l'ID du job est défini
      const formData = new FormData();
      formData.append('candidateName', this.contactForm.get('candidateName')!.value);
      formData.append('email', this.contactForm.get('email')!.value);
      formData.append('jobId', jobId);
      formData.append('cv', this.cvFile);
      // Ajout
      // Appelez la méthode d'ajout du service avec les données du formulaire
      this.candidatesService.applyforjob(formData).subscribe(
        (response) => {
          console.log('Application submitted successfully:', response);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Application submitted successfully!',
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.dialogRef.close(true); // Fermer le dialogue après l'ajout réussi
            }
          });
        },
        (error) => {
          console.error('Error submitting application:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error submitting application!',
          });
          // Gérer les erreurs d'ajout
        }
      );
    } else {
      console.error('Error: Job ID is null');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Job ID is null!',
      });
      // Gérer le cas où l'ID du job est null
    }
  }
}
}
