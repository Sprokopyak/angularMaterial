import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth-service/auth.service';
import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignIn implements OnInit {
  isLoading = false;
  public loginForm: FormGroup;
  public resetPass: FormGroup;
  showResetPassword = false;

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    public dialog: MatDialog) {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
    });
    this.resetPass = this.fb.group({
      'email': ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit() { }

  showMessageDialog(message: string): void {
    this.dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  get email() {
    return this.loginForm.get('email')
  }
  get password() {
    return this.loginForm.get('password')
  }

  signin() {
    this.isLoading = true;
    return this.auth.emailLogin(this.email.value, this.password.value)
    .then(()=>{
      this.isLoading = false;
    })
    .catch((error) => {
      this.showMessageDialog('Ви ввели невірний емейл або пароль')
    })
  }

  get resetEmail() {
    return this.resetPass.get('email')
  }

  reset() {
    return this.auth.resetPassword(this.resetEmail.value)
      .then((data) => {
        this.showMessageDialog('Детеалі з відновленням паролю були відправлені на ваш емайл: ' + this.resetEmail.value)
      })
      .catch((error) => {
        this.showMessageDialog(error.message)
      })
  }
}