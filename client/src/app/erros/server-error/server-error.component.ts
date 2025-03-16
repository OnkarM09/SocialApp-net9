import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss'
})
export class ServerErrorComponent {
  errors: any;

  constructor(private readonly router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.errors = navigation?.extras?.state?.['error'];
  }
}
