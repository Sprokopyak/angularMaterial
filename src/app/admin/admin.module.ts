import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { AdminRoute } from './admin.route';
import { Admin } from './admin.component';

import { NgxGalleryModule } from 'ngx-gallery';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxGalleryModule,
    AdminRoute
  ],
  declarations: [
    Admin
  ]
})
export class AdminModule { }