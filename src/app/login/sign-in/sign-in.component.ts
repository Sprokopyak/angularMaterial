import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth-service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignIn implements OnInit {
  isLoading = false;
  public loginForm: FormGroup;
  public resetPass: FormGroup;
  showResetPassword = false;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public auth: AuthService) {
    this.createLoginForm();
    this.resetPass = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  createLoginForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
    });
  }

  ngOnInit() { }

  get email() {
    return this.loginForm.get('email')
  }
  get password() {
    return this.loginForm.get('password')
  }

  signIn() {
    this.submitted = true;
    this.isLoading = true;
    return this.auth.emailLogin(this.email.value, this.password.value)
      .then(() => {
        this.isLoading = false;
      })
  }

  get resetEmail() {
    return this.resetPass.get('email')
  }

  reset() {
    this.isLoading = true;
    return this.auth.resetPassword(this.resetEmail.value)
    .then(() => {
      this.isLoading = false;
    })
  }
}