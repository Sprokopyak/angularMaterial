import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AppRoutes } from './../app.routes';

import { AddCafe } from './add-cafe/add-cafe.component';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    AgmCoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutes
  ],
  declarations: [
    AddCafe
  ],
  exports: [AddCafe]
})
export class CafeModule { }