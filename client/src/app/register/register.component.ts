import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  cancelRegistration = output<boolean>();
  registerForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeRegisterForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), this.matchValues('password')]]
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: _ => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value == control.parent?.get(matchTo)?.value ? null : { isMatching: true };
    }
  }

  register() {
    //To convert date and time to date only (removed time)
    const dob = this.dateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
      },
      error: (err) => {
        this.validationErrors = err;
      }
    });
  }

  cancel() {
    this.cancelRegistration.emit(false);
  }

  private dateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  }
}
