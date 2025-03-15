import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly accountService = inject(AccountService);
  title = 'client';
  users: any = [];

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }

  getUsers() {
    this.http.get('https://localhost:5111/api/users').subscribe(({
      next: (res: any) => {
        console.log(res);
        this.users = res;
      },
      error: (err) => {
        console.log('error: ', err);
      }
    }));
  }

  setCurrentUser() {
    const userString = localStorage['user'];
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
}
