import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`)
      .pipe(
        map(users => {
          if (users.length > 0 && this.verifyPassword(password, users[0].password)) {
            const user = users[0];
            const token = this.generateToken(user);
            console.log(token)
            user.token = token; 
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.router.navigate(['/tasks']);
            return user;
          } else {
            throw new Error('Invalid credentials');
          }
        })
      ).subscribe(
        user => {},
        error => {
          alert(error.message);
        }
      );
  }

  register(email: string, password: string) {
    const user = { email, password };
    return this.http.post<any>(this.apiUrl, user)
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        error => {
          alert('Registration failed');
        }
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private verifyPassword(inputPassword: string, storedPassword: string): boolean {
    return inputPassword === storedPassword;
  }

  private generateToken(user: any): string {
    return btoa(JSON.stringify(user));
  }

  public getToken(): string {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.token : null;
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
