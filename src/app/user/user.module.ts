import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { UserComponent } from './user.component';
import { UserRoute } from './user.route';
import { PipesModule } from '../pipes/pipes.module';
import { CafeModule } from '../cafe/cafe.module'

@NgModule({
  imports: [
    CommonModule,
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