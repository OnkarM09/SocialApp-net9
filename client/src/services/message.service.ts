import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../app/models/pagination';
import { Message } from '../app/models/message';
import { setPaginationHeaders, setPaginationResponse } from '../app/helpers/paginationHeaders';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);
    return this.http.get<Message[]>(`${this.baseUrl}messages`, {
      observe: 'response', params
    }).subscribe({
      next: response => setPaginationResponse(response, this.paginatedResult)
    });
  }
}
