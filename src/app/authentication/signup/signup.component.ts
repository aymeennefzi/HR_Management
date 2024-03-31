import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '@core/service/auth.service';
import { Auth } from '@core/models/auth';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        RouterLink,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
    ],
})
export class SignupComponent implements OnInit {
  authForm!: UntypedFormGroup;
  name!:string;
  email!:string;
  password!:string;
  confirmPassword!:string;
  roleName:any
  listComptes: Auth [] = [];
  submitted = false;
  returnUrl!: string;
  hide = true;
  chide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userservice:AuthService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
      roleName: ['', Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      this.router.navigate(['/admin/dashboard/main']);
    }
  }
  signup() {
    const signupDto = {
      name: this.name,
      email: this.email,
      password: this.password,
      roleName: this.roleName
    };
    console.log(signupDto);

    this.userservice.signUp(signupDto)
      .subscribe();
  }
}