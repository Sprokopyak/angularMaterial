import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { CafeDetails } from './cafe-details.component';
import { CafeList } from '../cafe-list/cafe-list.component'

const routes: Routes = [
  { path: '', component: CafeDetails },
  { path: '', component: CafeList }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CafeDetailsRoute { }