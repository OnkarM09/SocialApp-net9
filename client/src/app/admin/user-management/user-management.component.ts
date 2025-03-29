import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {

  private readonly adminService = inject(AdminService);
  private readonly modalService = inject(BsModalService);

  bsModalRef : BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  users : User[] = [];

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  openRolesModal(){
    const initState : ModalOptions = {
      class: 'modal-lg',
      initialState : {
        title: 'User roles',
        list: ['Admin', 'Moderator', 'Member']
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, initState);
  }

  getUsersWithRoles(): void{
    this.adminService.getUsersWithRoles().subscribe({
      next : res => this.users = res
    })
  }
}
