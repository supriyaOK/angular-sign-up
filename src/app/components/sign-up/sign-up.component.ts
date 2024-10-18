import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      //check password and confirmPassword has values and if they are not equal
      return {
        passwordsDontMatch: true, //in error case we are passing a key passwordsDontMatch
      };
    }

    return null; //means there is no error
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService
  ) {}

  signUpForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator() }
  );

  //add accessors

  get name() {
    return this.signUpForm.get('name');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  submit() {
    if (!this.signUpForm.valid) return;
    const { name, email, password } = this.signUpForm.value;
    this.authService
      .signUp(name, email, password)
      .pipe(
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'signing in... ',
          error: ({ message }) => `${{ message }}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
