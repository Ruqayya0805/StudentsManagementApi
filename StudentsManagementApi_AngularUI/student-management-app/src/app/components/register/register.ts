import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');
  success = signal('');

  constructor(
    private service: StudentService,
    private router: Router
  ) {}

  register() {
    // Clear previous messages
    this.error.set('');
    this.success.set('');

    // Validation
    if (!this.email() || !this.password() || !this.confirmPassword()) {
      this.error.set('All fields are required');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    // Call registration API
    this.service.register(this.email(), this.password()).subscribe({
      next: (res) => {
        this.success.set('Registration successful! Redirecting to login...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        if (err.error?.errors) {
          const errorMessages = Object.values(err.error.errors).flat();
          this.error.set(errorMessages.join(', '));
        } else {
          this.error.set('Registration failed. Please try again.');
        }
      }
    });
  }
}