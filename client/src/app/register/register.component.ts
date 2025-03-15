import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly accountService = inject(AccountService);
  model: any = {};
  cancelRegistration = output<boolean>();

  register() {
    this.accountService.register(this.model).subscribe({
      next: (res) => {
        console.log('Registration successful: ', res);
        this.cancel();
      },
      error: (err) => {
        console.log('Error registering: ', err);
      }
    });
  }
  cancel() {
    this.cancelRegistration.emit(false);
  }
}
