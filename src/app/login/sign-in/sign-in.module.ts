import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import { SignIn } from './sign-in.component';
import { SignInRoute } from './sign-in.route';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SignInRoute
  ],
  declarations: [
    SignIn
  ]
})
export class SignInModule { }