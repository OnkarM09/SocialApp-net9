import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  registerMode: boolean = false;
  loginMode: boolean = false;
  loginToggle(): void {
    this.loginMode = !this.loginMode;
  }
  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegistration(value: boolean): void {
    this.registerMode = value;
  }

  onToggleRegister(event: any) {
    this.loginMode = false;
    this.registerMode = true;
  }
  onToggleLogin(){
    this.loginMode = true;
    this.registerMode = false;
  }
}
