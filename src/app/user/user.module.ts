import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { UserComponent } from './user.component';
import { UserRoute } from './user.route';
import { PipesModule } from '../pipes/pipes.module';
import { CafeModule } from '../cafe/cafe.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CafeModule,
    MaterialModule,
    PipesModule,
    UserRoute
  ],
  declarations: [
    UserComponent
  ]
})
export class UserModule { }