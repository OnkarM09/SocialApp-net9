import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { AccountService } from '../services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage['user'];
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
}
