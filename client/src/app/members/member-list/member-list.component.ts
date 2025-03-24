import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {

  readonly memberService = inject(MembersService);
  members: Member[] = [];
  pageNumber: number = 1;
  pageSize: number = 12;


  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.pageNumber, this.pageSize);
  }

  pageChangeEvent(event : any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }

}
