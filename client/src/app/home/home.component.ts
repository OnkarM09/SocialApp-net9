import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);
  registerMode: boolean = false;
  users: any = [];

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegistration(value : boolean): void {
    this.registerMode = value;
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
}
