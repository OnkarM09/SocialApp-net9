import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  registerMode: boolean = false;

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegistration(value: boolean): void {
    this.registerMode = value;
  }
}
