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

  @ViewChild('memberTabs', {static : true}) memberTabs? : TabsetComponent;
  activeTab? :TabDirective;
  messages: Message[] = [];

  member: Member = {} as Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next : data =>{
        this.member = data['member'];
        this.member && this.member.photos.forEach(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
        });
      }
    });
    this.route.queryParams.subscribe({
      next : (params) =>{
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  onUpdateMessages(message : Message){
    this.messages.push(message);
  }

  selectTab(heading: string) : void{
    if(this.memberTabs){
      const messageTab = this.memberTabs.tabs.find(tab => tab.heading == heading);
      if(messageTab){
        messageTab.active = true;
      }
    }
  }

  onTabActivated(data : TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading == 'Messages' && this.messages.length == 0 && this.member){
      this.messageService.getMessageThread(this.member.username).subscribe({
        next : res => this.messages = res
      });
    }
  }

}
