import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Message } from '../models/message';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule, RouterModule, FormsModule, TimeagoModule, PaginationModule, NgSelectModule, TooltipModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit{
  messageService = inject(MessageService);
  container : string = "Inbox";
  pageNumber = 1;
  pageSize  = 5;
  isOutbox : boolean = this.container == 'Outbox';
  messageTypeList = [
    {
      value : 'Unread',
      display : 'Unread'
    },
    {
      value : 'Inbox',
      display : 'Inbox'
    },
    {
      value: 'Outbox',
      display : 'Outbox'
    }
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  getRoute(message : Message){
    if(this.container == 'Outbox'){
      return `/members/${message.recipientUsername}`
    }
    return `/members/${message.senderUsername}`
  }

  pagedChangeEvent(event : any){
    if(this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  messageTypeChange(e : any){
    this.container = e;
    this.loadMessages();
  }

  deleteMessage(id : number){
    this.messageService.deleteMessage(id).subscribe({
      next : _=>{
        this.messageService.paginatedResult.update( prev =>{
          if(prev?.items){
            prev.items.splice(prev.items?.findIndex( i => i.id == id), 1);
            return prev;
          }
          return prev;
        })
      }
    })
  }
}
