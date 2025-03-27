import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../app/models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  likeIds = signal<number[]>([]);

  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLikes(predecate: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}likes?predicate=${predecate}`);
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`)
      .subscribe({
        next: ids => this.likeIds.set(ids)
      });
  }
}
