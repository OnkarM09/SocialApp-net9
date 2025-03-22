import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Member } from '../app/models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}users`);
  }

  getMember(username: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}users`, member);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }
}
