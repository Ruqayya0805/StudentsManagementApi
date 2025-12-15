import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../models/studentmodel';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.html',
  styleUrls: ['./students.css']
})
export class StudentsComponent implements OnInit {
  students = signal<Student[]>([]);
  showAddForm = signal(false);
  editMode = signal(false);
  currentStudent = signal<Student>({ id: 0, name: '', class: '', section: '' });
  userEmail = signal('');

  constructor(
    private service: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    this.userEmail.set(email || 'User');
    this.loadStudents();
  }

  loadStudents() {
    this.service.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);
      },
      error: (err) => {
        console.error('Error loading students:', err);
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  openAddForm() {
    this.editMode.set(false);
    this.currentStudent.set({ id: 0, name: '', class: '', section: '' });
    this.showAddForm.set(true);
  }

  openEditForm(student: Student) {
    this.editMode.set(true);
    this.currentStudent.set({ ...student });
    this.showAddForm.set(true);
  }

  closeForm() {
    this.showAddForm.set(false);
    this.currentStudent.set({ id: 0, name: '', class: '', section: '' });
  }

  saveStudent() {
    const student = this.currentStudent();
    
    if (!student.name || !student.class || !student.section) {
      alert('All fields are required');
      return;
    }

    if (this.editMode()) {
      this.service.updateStudent(student).subscribe({
        next: () => {
          this.loadStudents();
          this.closeForm();
        },
        error: (err) => console.error('Error updating student:', err)
      });
    } else {
      this.service.addStudent(student).subscribe({
        next: () => {
          this.loadStudents();
          this.closeForm();
        },
        error: (err) => console.error('Error adding student:', err)
      });
    }
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.service.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (err) => console.error('Error deleting student:', err)
      });
    }
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}