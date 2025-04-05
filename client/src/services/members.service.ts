import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { Member } from '../app/models/member';
import { debounceTime, Observable } from 'rxjs';
import { PaginatedResult } from '../app/models/pagination';
import { UserParams } from '../app/models/userParams';
import { AccountService } from './account.service';
import { setPaginationHeaders, setPaginationResponse } from '../app/helpers/paginationHeaders';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly http = inject(HttpClient);
  private readonly acountService = inject(AccountService);
  private readonly baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  user = this.acountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {
    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);
    params = params.append('searchString', this.userParams().searchString);

    return this.http.get<Member[]>(`${this.baseUrl}users`, {
      observe: 'response',
      params: params
    }).subscribe({
      next: response => setPaginationResponse(response, this.paginatedResult)
    });
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

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  getUsersFromSearch(searchString: string) {
    return this.http.get<Member[]>(`${this.baseUrl}users/search/${searchString}`).pipe(
      debounceTime(300)
    );
  }
}
