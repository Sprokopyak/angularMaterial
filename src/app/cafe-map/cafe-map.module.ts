import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { CafeMap } from './cafe-map.component';
import { CafeMapRoute } from './cafe-map.route';
import { CafeModule } from '../cafe/cafe.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CafeModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAaWrqJxjZiw7BTzD9wDLybddkb1ktedKQ',
      libraries: ['places', 'geometry'],
      language: 'uk-UA',
      region: 'UA'
    }),
    CafeMapRoute
  ],
  declarations: [
    CafeMap
  ]
})
export class CafeMapModule { }