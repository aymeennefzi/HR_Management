import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '@core';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RouterLink
    ],
})
export class ForgotPasswordComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authS: AuthService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }
  // onSubmit() {
  //   this.submitted = true;
  //   // stop here if form is invalid
  //   if (this.authForm.invalid) {
  //     return;
  //   } else {
  //     this.router.navigate(['/dashboard/main']);
  //   }
  // }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    } else {
      const email = this.authForm.value.email;
      this.authS.forgotPassword(email).subscribe(
        (response) => {
          const lastName = response.lastName;
          const firstName = response.firstName;
          const image = response.profileImage ?? '';
          this.authS.setUserData(lastName, firstName, image);
          // Afficher une alerte SweetAlert pour informer l'utilisateur
          Swal.fire({
            icon: 'success',
            title: 'E-mail sent successfully',
            text: 'Please check your e-mail for the pin code.',
          }).then(() => {
            // Rediriger vers la page de verrouillage
            this.router.navigate(['/authentication/locked']);
          });
        },
        (error) => {
          console.error('Error occurred while sending email:', error);
          // Afficher une alerte SweetAlert pour informer l'utilisateur de l'erreur
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while sending the email. Please try again later.',
          });
        }
      );
    }
  }
}
