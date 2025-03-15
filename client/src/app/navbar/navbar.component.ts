import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  accountService = inject(AccountService);
  model: any = {};
  loggedIn: boolean = false;

  login() {
    this.accountService.login(this.model).subscribe({
      next: (res) => {
        console.log("Login Successful", res);
      },
      error: (err) => {
        console.error("Error during Login", err);
      }
    })
  }

  logout() {
    this.accountService.logout();
  }
}
