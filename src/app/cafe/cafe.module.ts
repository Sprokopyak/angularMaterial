import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { NgxGalleryModule } from 'ngx-gallery';
import { CafeList } from './cafe-list/cafe-list.component';
import { RatingComponent } from './rating/rating.component';

import { AgmCoreModule } from '@agm/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    AgmCoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxGalleryModule,
    PipesModule,
    RouterModule
  ],
  declarations: [
    RatingComponent,
    CafeList
  ],
  exports: [CafeList, RatingComponent],
  providers: [AngularFireStorage, AngularFirestore]
})
export class CafeModule { }