import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../app/models/user';
import { map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
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
