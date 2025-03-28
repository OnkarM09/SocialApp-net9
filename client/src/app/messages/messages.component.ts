import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit{
  messageService = inject(MessageService);
  container = 'Inbox';
  pageNumber = 1;
  pageSize  = 5;
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  pagedChangeEvent(event : any){
    if(this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
