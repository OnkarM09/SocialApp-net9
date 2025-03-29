import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {

  private readonly adminService = inject(AdminService);
  users : User[] = [];

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles(): void{
    this.adminService.getUsersWithRoles().subscribe({
      next : res => this.users = res
    })
  }
}
