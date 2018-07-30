import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AgmCoreModule } from '@agm/core';
import { AddCafeRoute } from './add-cafe.route';
import { AddCafe } from './add-cafe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAaWrqJxjZiw7BTzD9wDLybddkb1ktedKQ',
      libraries: ['places', 'geometry'],
      language: 'uk-UA',
      region: 'UA'
    }),
    AddCafeRoute
  ],
  declarations: [
    AddCafe
  ]
})
export class AddCafeModule { }