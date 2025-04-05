import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { sortingList } from '../../models/sortList';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, NgSelectModule, TooltipModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  providers: [BsModalService]
})
export class MemberListComponent implements OnInit {
  readonly memberService = inject(MembersService);
  private readonly modalService = inject(BsModalService);

  members: Member[] = [];
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Female' }];
  sortingList = sortingList;
  modalRef?: BsModalRef;
  searchString : string = '';

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.memberService.getMembers();
  }

  resetFilter() {
    this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChangeEvent(event: any) {
    if (this.memberService.userParams().pageNumber != event.page) {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }

  openFilterModal(modalTemplate: TemplateRef<void>) {
    this.modalRef = this.modalService.show(modalTemplate);
  }

  sortChange(event: any) {
    this.loadMembers();
  }

  searchUsers(){
    this.memberService.getUsersFromSearch(this.searchString).subscribe({
      next : (response : Member[]) => {
        this.members = response;
      }
    })
  }
}
