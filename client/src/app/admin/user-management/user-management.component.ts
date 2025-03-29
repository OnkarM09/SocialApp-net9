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

  openRolesModal(user : User){
    const initState : ModalOptions = {
      class: 'modal-lg',
      initialState : {
        title: 'User roles',
        userName : user.username,
        selectedRoles : [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        users: this.users,
        rolesUpdated : false
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, initState);
    this.bsModalRef.onHide?.subscribe({
      next : () => {
        if(this.bsModalRef.content?.rolesUpdated){
            const selectedRoles = this.bsModalRef.content.selectedRoles;
            this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
              next : roles => user.roles = roles
            })
        }
      }
    })
  }

  getUsersWithRoles(): void{
    this.adminService.getUsersWithRoles().subscribe({
      next : res => this.users = res
    })
  }
}
