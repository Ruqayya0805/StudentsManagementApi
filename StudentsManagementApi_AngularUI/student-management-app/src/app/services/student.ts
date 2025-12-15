import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/studentmodel';

@Injectable({
  providedIn: 'root',
})
export class StudentService {


  private apiUrl = 'http://localhost:5141/api/students';
  private authUrl = 'http://localhost:5141/api/Auth';

  constructor(private http: HttpClient) {}

  
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, {
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, {
      email,
      password,
    });
  }

  
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, this.getAuthHeaders());
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student, this.getAuthHeaders());
  }

  updateStudent(student: Student): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${student.id}`,
      student,
      this.getAuthHeaders()
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }
}
