import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../app/models/user';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly likeService = inject(LikesService);
  private readonly baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  setCurrentUser(user: User) {
    localStorage['user'] = JSON.stringify(user);
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }

  login(payload: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, payload).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  register(userData: any) {
    return this.http.post<User>(`${this.baseUrl}account/register`, userData).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
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
