import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member';
import { DatePipe } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private readonly memberService = inject(MembersService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('memberTabs') memberTabs? : TabsetComponent;
  activeTab? :TabDirective;
  messages: Message[] = [];

  member?: Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  onTabActivated(data : TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading == 'Messages' && this.messages.length == 0 && this.member){
      this.messageService.getMessageThread(this.member.username).subscribe({
        next : res => this.messages = res
      });
    }
  }

  loadMember() {
    const userName = this.route.snapshot.paramMap.get("username");
    if (!userName) return;
    this.memberService.getMember(userName).subscribe({
      next: (member: Member) => {
        this.member = member;
        member.photos.forEach(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
        });
      }
    });
  }
}
