import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member';
import { DatePipe } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../../services/message.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PresenceService } from '../../../services/presence.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent, TooltipModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  presenceService = inject(PresenceService);
  accountService = inject(AccountService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  activeTab?: TabDirective;

  member: Member = {} as Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.forEach(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
        });
      }
    });
    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  selectTab(heading: string): void {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(tab => tab.heading == heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading == 'Messages' && this.member) {
      const user = this.accountService.currentUser();
      if (!user) return;
      this.messageService.createHubConnection(user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
