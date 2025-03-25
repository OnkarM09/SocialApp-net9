import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../../services/account.service';
import { UserParams } from '../../models/userParams';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  readonly memberService = inject(MembersService);

  userParams = new UserParams(this.accountService.currentUser());
  members: Member[] = [];
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Female' }]

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.userParams);
  }

  resetFilter() {
    this.userParams = new UserParams(this.accountService.currentUser());
    this.loadMembers();
  }

  pageChangeEvent(event: any) {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }

}
