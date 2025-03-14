import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);
  title = 'client';
  users : any  = [];

  ngOnInit(): void {
    this.http.get('https://localhost:5111/api/users').subscribe(({
      next : (res : any) => {
        console.log(res);
        this.users = res;
      },
      error : (err) => {
        console.log('error: ', err);
      }
    }));
  }
}
