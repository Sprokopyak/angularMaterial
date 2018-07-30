import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import { CafeDetailsRoute } from './cafe-details.route';
import { CafeDetails } from './cafe-details.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { CafeModule } from '../cafe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxGalleryModule,
    CafeDetailsRoute,
    CafeModule,
  ],
  declarations: [CafeDetails],
  exports: [CafeDetails]
})
export class CafeDetailsModule { }