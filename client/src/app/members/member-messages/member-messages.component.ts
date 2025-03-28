import { Component, inject, input, OnInit } from '@angular/core';
import { Message } from '../../models/message';
import { MessageService } from '../../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss'
})
export class MemberMessagesComponent implements OnInit {
  username = input.required<string>();
  messages : Message[] = [];

  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessageThread(this.username()).subscribe({
      next : res => this.messages = res
    });
  }

}
