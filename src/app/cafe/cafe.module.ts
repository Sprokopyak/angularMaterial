import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AppRoutes } from './../app.routes';

import { AddCafe } from './add-cafe/add-cafe.component';
import { CafeDetails } from './cafe-details/cafe-details.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { RatingComponent } from './rating/rating.component';
import { CafeList } from './cafe-list/cafe-list.component';

import { AgmCoreModule } from '@agm/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    AgmCoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutes,
    NgxGalleryModule,
    PipesModule
  ],
  declarations: [
    AddCafe,
    CafeDetails,
    RatingComponent,
    CafeList
  ],
  exports: [AddCafe, CafeDetails,RatingComponent, CafeList],
  providers: [AngularFireStorage, AngularFirestore]
})
export class CafeModule { }