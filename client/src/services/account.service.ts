import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../app/models/user';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly likeService = inject(LikesService);
  private readonly presenceService = inject(PresenceService);
  private readonly baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  roles = computed(() => {
    const user = this.currentUser();
    if (user?.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  })

  setCurrentUser(user: User) {
    localStorage['user'] = JSON.stringify(user);
    this.currentUser.set(user);
    this.likeService.getLikeIds();
    this.presenceService.createHubConnection(user);
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
    this.presenceService.stopHubConnection();
  }
}
