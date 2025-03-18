import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, DatePipe, FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss'
})
export class MemberEditComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly memberService = inject(MembersService);
  private readonly toaster = inject(ToastrService);

  @ViewChild('editForm') editForm? : NgForm;

  member!: Member;

  ngOnInit(): void {
    const username = this.accountService.currentUser()?.username;
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: (resMember: Member) => {
        this.member = resMember;
      }
    });
  }

  updateProfile(){
    console.log(this.member);
    this.toaster.success("Your profile details have been successfully updated")
    this.editForm?.reset(this.member);
  }
}
