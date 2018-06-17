import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortenPipe } from './shorten.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ShortenPipe
  ],
  exports: [
    ShortenPipe
  ]
})
export class PipesModule { }