import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {


  userId = '';
  firstName = '';
  middleName = '';
  lastName = '';
  phone = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  termsAccepted = false;
  loading = false;

  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  // ✅ Strict password validation helpers
  get hasMinLength(): boolean {
    return this.password.length >= 8;
  }

  get hasLetter(): boolean {
    return /[A-Za-z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.password);
  }

  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasLetter && this.hasNumber;
  }

  get strengthLevel(): number {
    let score = 0;
    if (this.hasMinLength) score++;
    if (this.hasLetter) score++;
    if (this.hasNumber) score++;
    return score;
  }

  get passwordStrength(): string {
    if (!this.password) return '';
    if (this.strengthLevel === 1) return 'Weak';
    if (this.strengthLevel === 2) return 'Medium';
    if (this.strengthLevel === 3) return 'Strong';
    return 'Weak';
  }

  get canRegister(): boolean {
    return Boolean(
      this.firstName &&
      this.lastName &&
      this.phone &&
      this.email &&
      this.password &&
      this.confirmPassword &&
      this.passwordsMatch &&
      this.isPasswordValid &&
      this.termsAccepted
    );
  }

  onRegister() {

    this.loading = true;

    if (!this.passwordsMatch) {
      this.message = 'Passwords do not match';
      return;
    }

    if (!this.termsAccepted) {
      this.message = 'Please accept Terms & Conditions';
      return;
    }

    this.auth.register({
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' }
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err?.error?.message || 'Registration failed';
      }
    });
  }
}
