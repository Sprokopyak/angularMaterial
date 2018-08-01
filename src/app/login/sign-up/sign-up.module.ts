import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import { SignUp } from './sign-up.component';
import { SignUpRoute } from './sign-up.route';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SignUpRoute
  ],
  declarations: [
    SignUp
  ]
})
export class SignUpModule { }