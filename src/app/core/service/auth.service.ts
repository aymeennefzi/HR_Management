import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, UserData } from '../models/user';
import { Role } from '@core/models/role';
import { Auth } from '@core/models/auth';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  
  constructor(private http: HttpClient , private cookieService : CookieService , private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // login(username: string, password: string) {

  //   const user = this.users.find((u) => u.username === username && u.password === password);

  //   if (!user) {
  //     return this.error('Username or password is incorrect');
  //   } else {
  //     localStorage.setItem('currentUser', JSON.stringify(user));
  //     this.currentUserSubject.next(user);
  //     return this.ok({
  //       id: user.id,
  //       img: user.img,
  //       username: user.username,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       token: user.token,
  //     });
  //   }
  // }
  ok(body?: {
    id: number;
    img: string;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }
  error(message: string) {
    return throwError(message);
  }

  // logout() {
  //   // remove user from local storage to log user out
  //   localStorage.removeItem('currentUser');
  //   this.currentUserSubject.next(this.currentUserValue);
  //   return of({ success: false });
  // }
  private apiUrl = 'http://localhost:3000/auth'; // Remplacez cette URL par l'URL de votre backend
  logout() {
    // Supprimer les cookies
    this.cookieService.deleteAll();
  
    // Rediriger vers la page de connexion
    this.router.navigate(['/authentication/signin']);
  }


  signUp(signupDto: any): Observable<Auth> {
    return this.http.post<Auth>(this.apiUrl + "/signup", signupDto);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + "/allusers"); // Remplacez '/api/users' par l'URL de votre API pour récupérer les utilisateurs
  }

  login(email: string, password: string): Observable<any> {
    const loginDto = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        if (response?.token) {
          this.cookieService.set('token', response.token);
        }
      })
    );
  }
  setToken(token: string): void {
    localStorage.setItem('token', token); // Vous pouvez également utiliser des cookies comme expliqué précédemment
  }

  forgetPassword(): void{
  }

  async checkifemailvalid(email: string): Promise<boolean> {
    const url = this.apiUrl + "/isemailvalid" ;
    const response = await this.http.get<boolean>(url).toPromise();
    return response || false;
  }



  forgotPassword(email: string ): Observable<User> {
    return this.http.post<User>(this.apiUrl + "/forgot-password",{email} );
  }
  private userDataSubject = new BehaviorSubject<UserData>({ lastName: '', firstName: '', profileImage: '' });

  userData$ = this.userDataSubject.asObservable();

  setUserData(lastName: string, firstName: string, profileImage: string) {
    const userData: UserData = { lastName, firstName, profileImage };
    this.userDataSubject.next(userData);
  }
  getUserData(): Observable<UserData> {
    return this.userData$;
  }

  resetPassword(newPassword: string, pinCode: string): Observable<void> {
    const resetPasswordDto = { newPassword, pinCode };
    return this.http.post<void>(this.apiUrl + "/reset-password", resetPasswordDto);
  }
}
