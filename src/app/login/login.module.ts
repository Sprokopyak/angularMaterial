import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AppRoutes } from './../app.routes';

import { SignUp } from './sign-up/sign-up.component';
import { SignIn } from './sign-in/sign-in.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutes
  ],
  declarations: [
    SignUp,
    SignIn
  ],
  exports: [SignUp, SignIn]
})
export class LoginModule { }