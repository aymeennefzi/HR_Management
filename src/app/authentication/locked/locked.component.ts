import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Role, AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserData } from '@core/models/user';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-locked',
    templateUrl: './locked.component.html',
    styleUrls: ['./locked.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
    ],
})
export class LockedComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  userImg!: string;
  userFullName!: string;
  hide = true;
  userData!: UserData;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.getUserData().subscribe(userData => {
      this.userData = userData;
      this.userFullName = `${this.userData.firstName} ${this.userData.lastName}`;
      console.log(this.userData);
    });
    this.authForm = this.formBuilder.group({
      password: ['', Validators.required],
      pinCode: ['', Validators.required],

    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    }
    const { password, pinCode } = this.authForm.value;
    this.authService.resetPassword(password, pinCode).subscribe(
      () => {
        // SweetAlert to inform the user that their password has been successfully reset
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'Your password has been successfully reset.',
        }).then(() => {
          this.router.navigate(['/authentication/signin']);
        });
      },
      error => {
        console.error('Error resetting password:', error);
        // SweetAlert to inform the user about the error
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: 'An error occurred while resetting your password. Please try again later.',
        });
      }
    );
  }
}
