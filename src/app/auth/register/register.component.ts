// auth/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string;
  password: string;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.email, this.password);
  }
}
