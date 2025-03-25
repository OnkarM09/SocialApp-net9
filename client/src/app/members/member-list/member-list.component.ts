import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../../services/account.service';
import { UserParams } from '../../models/userParams';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  readonly memberService = inject(MembersService);

  userParams = new UserParams(this.accountService.currentUser());
  members: Member[] = [];

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {

    this.memberService.getMembers(this.userParams);
  }

  pageChangeEvent(event: any) {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }

}
