import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member';
import { DatePipe } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit {
  private readonly memberService = inject(MembersService);
  private readonly route = inject(ActivatedRoute);
  member?: Member;

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const userName = this.route.snapshot.paramMap.get("username");
    if (!userName) return;
    this.memberService.getMember(userName).subscribe({
      next: (member: Member) => {
        this.member = member;
      }
    });
  }
}
