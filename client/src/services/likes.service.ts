import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../app/models/member';
import { Observable, single } from 'rxjs';
import { setPaginationHeaders, setPaginationResponse } from '../app/helpers/paginationHeaders';
import { UserParams } from '../app/models/userParams';
import { AccountService } from './account.service';
import { PaginatedResult } from '../app/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLikes(predecate: string, pageNumber : number, pageSize : number) {
    let params = setPaginationHeaders(pageNumber, pageSize);
    params.append('predicate', predecate)
    return this.http.get<Member[]>(`${this.baseUrl}likes?predicate=${predecate}`,
      {
        observe: 'response',
        params: params
      }).subscribe({
        next : res => setPaginationResponse(res, this.paginatedResult)
      });
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`)
      .subscribe({
        next: ids => this.likeIds.set(ids)
      });
  }
}
