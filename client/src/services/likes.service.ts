import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  likeIds = signal<number[]>([]);

  toggleLike(targetId : number){
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLike(predecate : string){
    return this.http.get(`${this.baseUrl}likes?predicate=${predecate}`);
  }

  getLikeIds(){
    return this.http.get<number[]>(`${this.baseUrl}likes/list`)
    .subscribe({
      next : ids => this.likeIds.set(ids)
    });
  }
}
