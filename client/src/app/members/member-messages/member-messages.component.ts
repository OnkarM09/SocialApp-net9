import { Component, ElementRef, HostListener, inject, input } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule, PickerComponent],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss'
})
export class MemberMessagesComponent {
  username = input.required<string>();
  messageContent: string = '';
  toggledEmoji : boolean = false;
  messageService = inject(MessageService);

  constructor(private readonly eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.toggledEmoji && !this.eRef.nativeElement.contains(event.target)) {
      this.toggledEmoji = false;
    }
  }

  sendMessage(form: NgForm) {
    this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
      next: message => {
        form.reset();
      }
    });
  }

  addEmoji(event: any) {
    console.log(event)
    this.messageContent += event.emoji.native;
  }
}
