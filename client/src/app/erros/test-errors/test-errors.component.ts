import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.scss'
})
export class TestErrorsComponent {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  modelValidationErrors: string[] = [];

  get400Error() {
    this.http.get(`${this.baseUrl}buggy/bad-request`).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log('Error: ', err)
    });
  }

  get401Error() {
    this.http.get(`${this.baseUrl}buggy/auth`).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log('Error: ', err)
    });
  }

  get404Error() {
    this.http.get(`${this.baseUrl}buggy/not-found`).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log('Error: ', err)
    });
  }

  get500Error() {
    this.http.get(`${this.baseUrl}buggy/server-error`).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log('Error: ', err)
    });
  }

  getValidationsError() {
    this.http.post(`${this.baseUrl}account/register`, {}).subscribe({
      next: (res) => console.log(res),
      error: (err) => {
        console.log('Error: ', err);
        this.modelValidationErrors = err;
      }
    });
  }
}
