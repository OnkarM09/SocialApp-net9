import { Component, ElementRef, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  registerToggle = output<boolean>();
  accountService = inject(AccountService)
  router = inject(Router);
  toaster = inject(ToastrService)
  model: any = {};

  login(): void {
    console.log(this.model)
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: (err) => {
        console.error("Error during Login", err);
      }
    })
  }

  toggleRegister() {
    this.registerToggle.emit(true);
  }
  showPassword(passwordField : HTMLInputElement){
    if(passwordField.type == 'password') {
      passwordField.type = 'text';
    }else{
      passwordField.type = 'password';
    }
  }

}
