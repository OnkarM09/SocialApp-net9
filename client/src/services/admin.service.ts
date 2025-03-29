import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { User } from '../app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getUsersWithRoles(){
    return this.http.get<User[]>(`${this.baseUrl}admin/users-with-roles`);
  }
}
