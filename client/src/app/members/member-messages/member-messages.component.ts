import { Component, inject, input, output } from '@angular/core';
import { Message } from '../../models/message';
import { MessageService } from '../../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss'
})
export class MemberMessagesComponent  {
  username = input.required<string>();
  messages = input.required<Message[]>();
  updateMessages = output<Message>();
  messageContent : string = '';
  private readonly messageService = inject(MessageService);

  sendMessage(form : NgForm){
    this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
      next : message => {
        this.updateMessages.emit(message);
        form.reset();
      }
    });
  }
}
