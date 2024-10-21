import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService
  ) {}

  //Create login form group with email and password controls
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  async forgetPassword() {
    const { email } = this.loginForm.value;
    if (!email) {
      // this.notification.error("Please enter an email address.");
      alert('Please enter an email address.');
      return;
    }
    try {
      //this.notification.showLoading();
      await this.authService.passwordReset(email);
      //this.notification.success("Password reset.");
      alert('Password reset email has been sent please check your inbox.');
    } catch (err: any) {
      //this.notification.firebaeError(err);
    } finally {
      //this.notification.hideLoading();
    }
  }

  //to check some form field related errors we need to add
  //getter methods for the email and password controls
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    //destructure loginForm first it is a good practice
    const { email, password } = this.loginForm.value;
    this.authService
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'logged in successfully',
          loading: 'loggin in ... ',
          error: 'There was an error',
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
