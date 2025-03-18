import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {

  private readonly memberService = inject(MembersService);
  members: Member[] = [];

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (res: Member[]) => {
        this.members = res;
      }
    });
  }

}
