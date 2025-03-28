import { Component, inject, input } from '@angular/core';
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
export class MemberMessagesComponent  {
  username = input.required<string>();
  messages = input.required<Message[]>();

  private readonly messageService = inject(MessageService);
}
