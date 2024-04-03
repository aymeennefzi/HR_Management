import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
    ],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  email !: string ;
  password !: string ;

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieS : CookieService
  ) {
    super();
  
  }
  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    this.error = '';
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
  
    this.authService.login(email, password).subscribe(
      (response) => {
          const userData = {
          token: response.token,
          user: response.user  
        };
        const userDataString = JSON.stringify(userData);
        const data = this.cookieS.set('user_data', userDataString);
        const cookieData = this.cookieS.get('user_data'); // Obtenez le contenu du cookie
        if (cookieData) {
          try {
            const userData = JSON.parse(cookieData); // Décoder le contenu du cookie
          // Utilisez les informations utilisateur extraites
            const token = userData.token;
            const user = userData.user;
            console.log(user);
             // Déterminez la destination de la redirection en fonction du rôle de l'utilisateur
          if (user.role.includes('Employe')) {
            // Redirection vers le tableau de bord de l'employé
            this.router.navigate(['/employee/dashboard']);
          } else if (user.role.includes('Client')) {
            // Redirection vers le tableau de bord du client
            this.router.navigate(['/client/dashboard']);
          } else if (user.role.includes('Admin')) {
            // Redirection vers le tableau de bord de l'administrateur
            this.router.navigate(['/admin/dashboard']);
          } else {
            console.error(`Rôle d'utilisateur invalide : ${user.role}`);
            // Gérez le cas où le rôle de l'utilisateur n'est pas reconnu
          }
          } catch (error) {
          console.error('Erreur lors du décodage du cookie:', error);
          }
        } else {
          console.error('Le cookie "user_data" n\'est pas défini');
        }
      },
      (error) => {
        console.error('Erreur lors de la connexion:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: 'Email ou mot de passe incorrect'
        });
        
      }
    );
  }
}


  

