import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../app/models/pagination';
import { Message } from '../app/models/message';
import { setPaginationHeaders, setPaginationResponse } from '../app/helpers/paginationHeaders';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../app/models/user';
import { ToastrService } from 'ngx-toastr';
import { Group } from '../app/models/group';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly baseUrl = environment.apiUrl;
  private readonly hubUrl = environment.hubsUrl;

  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastrService);
  private readonly busyService = inject(BusyService);
  hubConnection?: HubConnection;

  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  messageThread = signal<Message[]>([]);
  userTyping = signal<any>(null);

  createHubConnection(user: User, otherUserName: string) {
    this.busyService.busy();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUserName, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(err => console.log(err)).finally(() => this.busyService.idle());

    this.hubConnection.on('RecievedMessageThread', messages => this.messageThread.set(messages));

    this.hubConnection.on('NewMessage', newMsg => this.messageThread.update((currentMessages) => [...currentMessages, newMsg]));

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUserName)) {
        this.messageThread.update(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          return messages;
        })
      }
    });

    this.hubConnection.on('UserIsTyping', (details: any) => {
      console.log('User typing', details);
      this.userTyping.set(details);
    });

    this.hubConnection.on('UserIsNotTyping', () => {
      console.log('User not typing');
      this.userTyping.set(null);
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => {
        console.log(err);
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

  async sendMessage(recipientUsername: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', {
      recipientUsername: recipientUsername,
      content
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

  sendUserTyping(userName: string) {
    return this.hubConnection?.invoke('ShowUserTyping', userName);
  }

  hideUserTyping() {
    return this.hubConnection?.invoke('HideUserTyping');
  }
}
