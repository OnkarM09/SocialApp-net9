import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../app/models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  baseUrl = 'https://localhost:5111/api/';
  currentUser = signal<User | null>(null);

  login(payload: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, payload).pipe(
      map(user => {
        if (user) {
          localStorage['user'] = JSON.stringify(user);
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }

  register(userData: any) {
    return this.http.post<User>(`${this.baseUrl}account/register`, userData).pipe(
      map(user => {
        if (user) {
          localStorage['user'] = JSON.stringify(user);
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
