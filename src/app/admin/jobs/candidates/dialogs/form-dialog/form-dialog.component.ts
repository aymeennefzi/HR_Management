import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CandidatesService } from '../../candidates.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Candidates } from '../../candidates.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { JobsListService } from 'app/admin/jobs/jobs-list/jobs-list.service';
import { CommonModule } from '@angular/common';
import { JobsList } from 'app/admin/jobs/jobs-list/jobs-list.model';

export interface DialogData {
  id: number;
  action: string;
  candidates: Candidates;
}
@Component({
    selector: 'app-form-dialog:not(e)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
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
})
export class FormDialogComponent implements OnInit {
  openJobTitles: string[] = [];
  action: string;
  dialogTitle: string;
  candidatesForm: UntypedFormGroup;
  candidates: Candidates;
  job!:JobsList;
  jobs: any[] = [];
  cvFile: File | null = null;
  contactForm!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public candidatesService: CandidatesService,
    private fb: UntypedFormBuilder,
    private jobService: JobsListService
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
  }
  // ngOnInit(): void {
  //   this.contactForm = this.fb.group({
     
  //     id: [this.data.id], // Assurez-vous que l'ID est initialisé correctement
  //     title: [this.data.jobsList.title, Validators.required],
  //     description: [this.data.jobsList.description, Validators.required],
  //     location: [this.data.jobsList.location, Validators.required],
  //     contractType: [this.data.jobsList.contractType, Validators.required],
  //     salary: [this.data.jobsList.salary, Validators.required],
  //     applicationDeadline: [this.data.jobsList.applicationDeadline, Validators.required],
  //     status: [this.data.jobsList.status, Validators.required],
  //     publicationDate: [this.data.jobsList.publicationDate, Validators.required],
  //     requiredSkills: [this.data.jobsList.requiredSkills, Validators.required],
  //     recruitingManager: [this.data.jobsList.recruitingManager, Validators.required]
  //   });
  // }
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
   
  }
  createContactForm(): UntypedFormGroup {
    // const fileName = this.candidates.cv.split('/').pop();
    const fileName = this.candidates.cv ? this.candidates.cv.split('/').pop() : null;
    const jobTitle = this.jobs.find(job => job._id === this.candidates.jobId)?.title || null;
    return this.fb.group({
      // id: [this.candidates._id],
      // img: [this.candidates.jobId],
      // candidateName: [this.candidates.candidateName],
      // cv: [this.candidates.cv],
    //   candidateName: ['', Validators.required],
    //   email: ['', Validators.required],
    //   cv: ['', Validators.required],
    //   jobId: ['', Validators.required]
     
    // });
    
      id: [this.candidates._id],
      candidateName: [this.candidates.candidateName],
      
      email: [this.candidates.email],
      jobId: [this.candidates.jobId],
      // cv: [this.candidates.cv],
      cv: [fileName],
      jobTitle: [jobTitle],
      
     
    });
  }
  getCvPath(): string {
    // Vérifiez si le candidat a un CV et retournez le chemin approprié
    return this.candidates.cv ? `file:///${this.candidates.cv}` : ''; // Modifiez ceci pour ajuster le format du chemin si nécessaire
  }
 
  onFileSelected(event: any) {
    this.cvFile = event.target.files[0] as File;
    // Utilisez 'controls' pour accéder aux contrôles du formulaire
    this.contactForm.controls['cv'].setValue(this.cvFile ? this.cvFile.name : '');
  }
  // getJobs(): void {
  //   this.jobService.getJobs().subscribe(
  //     (jobs: any[]) => {
  //       this.jobs = jobs;
       
        
  //     },
  //     (error) => {
  //       console.error('Error fetching jobs:', error);
  //     }
  //   );
  // }
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
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
 
  // public confirmAdd(): void {
  //   if (this.contactForm && this.contactForm.valid && this.cvFile) {
  //     const formData = new FormData();
  //     formData.append('candidateName', this.contactForm.get('candidateName')!.value);
  //     formData.append('email', this.contactForm.get('email')!.value);
  //     formData.append('jobId', this.contactForm.get('jobId')!.value);
  //     formData.append('cv', this.cvFile);
  
  //     this.candidatesService.applyforjob(formData).subscribe(
  //       (response) => {
  //         // Traitement du succès de la requête
  //         console.log('Application submitted successfully:', response);
  //         alert('Application submitted successfully!');
  //         this.dialogRef.close(true); // Fermer le dialogue après la soumission réussie
  //       },
  //       (error) => {
  //         // Gérer les erreurs de la requête
  //         console.error('Error submitting application:', error);
  //         // Afficher un message d'erreur à l'utilisateur si nécessaire
  //       }
  //     );
  //   }
  // }
  
  public confirmAdd(): void {
    if (this.contactForm && this.contactForm.valid && this.cvFile) {
      const formData = new FormData();
      formData.append('candidateName', this.contactForm.get('candidateName')!.value);
      formData.append('email', this.contactForm.get('email')!.value);
      formData.append('jobId', this.contactForm.get('jobId')!.value);
      formData.append('cv', this.cvFile);
  
      if (this.action === 'edit') {
        // Modification
        // Appelez la méthode de mise à jour du service avec l'ID du candidat et les données mises à jour
        this.candidatesService.updateCandidate(this.candidates._id, formData).subscribe(
          (response) => {
            console.log('Candidate updated successfully:', response);
            alert('Candidate updated successfully!');
            this.dialogRef.close(true); // Fermer le dialogue après la mise à jour réussie
          },
          (error) => {
            console.error('Error updating candidate:', error);
            // Gérer les erreurs de mise à jour
          }
        );
      } else {
        // Ajout
        // Appelez la méthode d'ajout du service avec les données du formulaire
        this.candidatesService.applyforjob(formData).subscribe(
          (response) => {
            console.log('Application submitted successfully:', response);
            alert('Application submitted successfully!');
            this.dialogRef.close(true); // Fermer le dialogue après l'ajout réussi
          },
          (error) => {
            console.error('Error submitting application:', error);
            // Gérer les erreurs d'ajout
          }
        );
      }
    }
  }
  
  
}
