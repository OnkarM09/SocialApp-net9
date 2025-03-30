import { AfterViewChecked, Component, ElementRef, HostListener, inject, input, ViewChild } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule, PickerComponent, NgClass],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss'
})
export class MemberMessagesComponent implements AfterViewChecked {

  @ViewChild('chatScroll') chatScroll?: any;

  messageService = inject(MessageService);

  username = input.required<string>();

  messageContent: string = '';
  toggledEmoji: boolean = false;

  constructor(private readonly eRef: ElementRef) { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.chatScroll) {
      this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.toggledEmoji && !this.eRef.nativeElement.contains(event.target)) {
      this.toggledEmoji = false;
    }
  }

  sendMessage(form: NgForm) {
    this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
      form.reset();
      this.scrollToBottom();
    })
  }

  addEmoji(event: any) {
    console.log(event)
    this.messageContent += event.emoji.native;
  }
}
