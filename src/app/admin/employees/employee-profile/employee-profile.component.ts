import { Component, ElementRef, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmployeesService } from '../allEmployees/employees.service';
import { Employees } from '../allEmployees/employees.model';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ImageService } from '../image.service';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FileUploadComponent,


  ],
})
export class EmployeeProfileComponent implements OnInit  {
  user!: Employees;
  docForm!: UntypedFormGroup;
 private  selectedFile!: File | null;
  private elementRef!: ElementRef // Injectez ElementRef

  constructor(private fb: UntypedFormBuilder , private emploueeS : EmployeesService , private cookieService : CookieService,  private imageService: ImageService) {
    this.docForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      location: [''],
      Tel: ['', ],
      city: [''],
      adresse: [''],
      country: [''],
      aboutme: [''],
      Matricule: ['',],
      education: ['', ],
      experience: [''],
      skills: [''],
      datebirth: [''],
      EmailSecondaire: [''],
      uploadImg: [''],

    });
  }
  
  ngOnInit(): void {
  this.loadUserData();
    }
    // loadUserData(): void {
    //   const cookieData = this.cookieService.get('user_data');
    //   const userData = JSON.parse(cookieData);
    //   const id = userData.user.id;
    //   this.emploueeS.getUserById(id).subscribe({
    //     next: (user: Employees) => {
    //       this.user = user;
    //       this.docForm.patchValue(user);
    //     }
    //   });
    // }
    loadUserData(): void {
      const cookieData = this.cookieService.get('user_data');
      const userData = JSON.parse(cookieData);
      const id = userData.user.id;
      this.emploueeS.getUserById(id).subscribe({
        next: (user: Employees) => {
          this.user = user;
          this.docForm.patchValue(user);
        }
      });
    }
    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0] as File;
    }
  
    // onSubmit(): void {
    //   if (this.docForm.valid) {
    //     const cookieData = this.cookieService.get('user_data');
    //     const userData = JSON.parse(cookieData);
    //     const id = userData.user.id;
    //     const updatedEmployeeData = this.docForm.value;
    //     this.emploueeS.updateUser(id , updatedEmployeeData).subscribe(updatedEmployee =>{
    //       alert('update sucess')
    //       this.loadUserData();
    //       const aboutMeSection = this.elementRef.nativeElement.querySelector('#aboutMeSection');
    //       if (aboutMeSection) {
    //         aboutMeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //       }
    //     })
    //   }
    // }
    onSubmit(): void {
      if (this.docForm.valid && this.selectedFile) { // Vérifiez si this.selectedFile n'est pas null
        const formData = new FormData();
        formData.append('uploadImg', this.selectedFile);
    
        const cookieData = this.cookieService.get('user_data');
        const userData = JSON.parse(cookieData);
        const userId = userData.user.id;
    
        // Utilisez this.selectedFile au lieu de this.selectedFile.name
        this.emploueeS.uploadImage(userId, this.selectedFile).subscribe({
          next: (res) => {
            console.log("response",res);
            const imageemit=res.profileImage;
            // Le téléchargement de l'image a réussi, vous pouvez traiter la réponse ici
            const imageUrl = res.imageUrl; 
            console.log("upload",imageUrl);
            
            let user =userData.user;
            // Supposons que votre API renvoie l'URL de l'image téléchargée
            this.docForm.patchValue({ uploadImg: imageUrl });
            this.imageService.emitImageUpdated(imageemit);
    
            // Maintenant, mettez à jour les autres champs du profil de l'employé
            const updatedEmployeeData = this.docForm.value;
            this.emploueeS.updateUser(userId, updatedEmployeeData).subscribe((updatedEmployee) => {
              // Gérez la réponse de mise à jour de l'utilisateur ici
              alert('Profile updated successfully');
              this.loadUserData();
            });
          },
          error: (error) => {
            // Gérez les erreurs de téléchargement de l'image ici
            console.error('Error uploading image:', error);
          },
        });
      } else {
        // Gérer le cas où aucun fichier n'est sélectionné ou le formulaire n'est pas valide
      }
    }
    // onSubmit(): void {
    //   if (this.docForm.valid) {
    //     const cookieData = this.cookieService.get('user_data');
    //     const userData = JSON.parse(cookieData);
    //     const id = userData.user.id;
    //     const updatedEmployeeData = this.docForm.value;
    //     this.emploueeS.updateUser(id, updatedEmployeeData).subscribe(updatedEmployee => {
    //       alert('Update successful');
    //       this.loadUserData();
    //     });
    //   }
    // }
    // onSubmit(): void {
    //   if (this.docForm.valid) {
    //     const cookieData = this.cookieService.get('user_data');
    //     const userData = JSON.parse(cookieData);
    //     const id = userData.user.id;
    //     const formData = new FormData();
    //     formData.append('firstName', this.docForm.get('firstName')!.value);
    //     formData.append('lastName', this.docForm.get('lastName')!.value);
    //     // Ajoutez d'autres champs au besoin
    //     formData.append('uploadImg', this.docForm.get('uploadImg')!.value);
        
    //     // Assurez-vous d'envoyer FormData pour inclure le fichier image
    //     this.emploueeS.updateUser(id, formData).subscribe(updatedEmployee => {
    //       alert('Update successful');
    //       this.loadUserData();
    //     });
    //   }
    // }
    
  
}
