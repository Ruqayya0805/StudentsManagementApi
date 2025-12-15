import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  error = signal('');

  constructor(
    private service: StudentService,
    private router: Router
  ) {}

  login() {
    this.error.set('');

    if (!this.email() || !this.password()) {
      this.error.set('Email and password are required');
      return;
    }

    this.service.login(this.email(), this.password()).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userEmail', res.email);
        this.router.navigate(['/students']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.error.set('Invalid email or password');
      }
    });
  }
}