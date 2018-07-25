import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth-service/auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUp implements OnInit {
  public signupForm: FormGroup;
  isLoading = false;

  constructor(
    public fb: FormBuilder,
    public auth: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), this.passwordConfirming]]
    })
  }

  ngOnInit() { }

  passwordConfirming(c: AbstractControl): any {
    if (!c.parent || !c) return;
    const pwd = c.parent.get('password');
    const cpwd = c.parent.get('confirmPassword')

    if (!pwd || !cpwd) return;
    if (pwd.value !== cpwd.value) {
      return { invalid: true };
    }
  }
  
  get name() {
    return this.signupForm.get('name')
  }
  get email() {
    return this.signupForm.get('email')
  }
  get password() {
    return this.signupForm.get('password')
  }

  signup() {
    this.isLoading = true;
    return this.auth.emailSignUp(this.name.value,this.email.value, this.password.value)
      .then(() => {
        this.isLoading = false;
      })
  }
}