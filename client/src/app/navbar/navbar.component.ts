import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HasRoleDirective } from '../_directives/has-role.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  accountService = inject(AccountService);
  private readonly router = inject(Router);
  loggedIn: boolean = false;

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  hideBootstrapNavCollapse(){
    const navbar = document.querySelector('.navbar-collapse');
    if(navbar != null){
      navbar.classList.remove('show');
    }
  }
}
