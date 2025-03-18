import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member';
import { DatePipe } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule, GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private readonly memberService = inject(MembersService);
  private readonly route = inject(ActivatedRoute);
  member?: Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
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
