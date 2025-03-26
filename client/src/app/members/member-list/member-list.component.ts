import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../../services/account.service';
import { UserParams } from '../../models/userParams';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { sortingList } from '../../models/sortList';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, NgSelectModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  providers: [BsModalService]
})
export class MemberListComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  readonly memberService = inject(MembersService);
  private readonly modalService = inject(BsModalService);

  userParams = new UserParams(this.accountService.currentUser());
  members: Member[] = [];
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Female' }];
  sortingList = sortingList;
  modalRef?: BsModalRef;

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    console.log(this.userParams);
    if (this.modalRef) {
      this.modalRef.hide();
    }
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

  openFilterModal(modalTemplate: TemplateRef<void>) {
    this.modalRef = this.modalService.show(modalTemplate);
  }

  sortChange(event: any) {
    this.loadMembers();
  }
}
