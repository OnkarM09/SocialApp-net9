import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../app/models/pagination';
import { Message } from '../app/models/message';
import { setPaginationHeaders, setPaginationResponse } from '../app/helpers/paginationHeaders';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../app/models/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly baseUrl = environment.apiUrl;
  private readonly hubUrl = environment.hubsUrl;

  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastrService);
  private hubConnection?: HubConnection;

  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  messageThread = signal<Message[]>([]);

  createHubConnection(user: User, otherUserName: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUserName, {
        accessTokenFactory: () => user.token
      }).withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(err => {
      console.log(err);
      this.toastService.error("Error while creating message hub connection!");
    });

    this.hubConnection.on('RecievedMessageThread', messages => {
      this.messageThread.set(messages)
    })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => {
        console.log(err);
        this.toastService.error("Error while stopping message hub connection!");
      })
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);
    return this.http.get<Message[]>(`${this.baseUrl}messages`, {
      observe: 'response', params
    }).subscribe({
      next: response => setPaginationResponse(response, this.paginatedResult)
    });
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username)
  }

  sendMessage(recipientUsername: string, content: string) {
    return this.http.post<Message>(`${this.baseUrl}messages`, { recipientUsername, content })
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
