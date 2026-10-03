import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',

  imports: [
    HeaderComponent,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal('');
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  login(): void {

    this.error.set('');
    this.success.set(false);

    if (!this.email.trim()) {
      this.error.set('Please enter your email.');
      return;
    }

    if (!this.password) {
      this.error.set('Please enter your password.');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must contain at least 6 characters.');
      return;
    }

    this.submitting.set(true);

    /*
     * MOCK LOGIN
     *
     * Later:
     * POST /api/auth/login
     *
     * {
     *   email,
     *   password
     * }
     */

    console.log('MOCK LOGIN', {
      email: this.email,
      password: this.password
    });

    setTimeout(() => {

      this.submitting.set(false);

      const user =
        this.authService.login(
          this.email
        );


      if (
        user.role === 'ADMIN'
      ) {

        this.router.navigate([
          '/admin'
        ]);

      } else {

        this.router.navigate([
          '/dashboard'
        ]);

      }

    }, 700);
  }
}