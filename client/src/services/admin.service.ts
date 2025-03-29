import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { User } from '../app/models/user';
import { PaginatedResult } from '../app/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getUsersWithRoles(){
    return this.http.get<User[]>(`${this.baseUrl}admin/users-with-roles`);
  }

  updateUserRoles(username : string, roles : string[]){
    return this.http.post<string[]>(`${this.baseUrl}admin/edit-roles/${username}?roles=${roles}`, {});
  }
}
