import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  registerMode: boolean = false;

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }
}
