import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../app/models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection? : HubConnection;
  private readonly toastService = inject(ToastrService);
  onlineUsers = signal<string[]>([]);

  createHubConnection(user : User){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence', {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => this.toastService.info(username + ' is online'));
    this.hubConnection.on('UserIsOffline', username => this.toastService.warning(username + ' is offline'));

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsers.set(usernames);
    })
  }

  stopHubConnection(){
    if(this.hubConnection?.state == HubConnectionState.Connected){
        this.hubConnection.stop().catch(err => console.log(err));
    }
  }
}
