import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { CafeMap } from './cafe-map.component';

const routes: Routes = [
  { path: '', component: CafeMap }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CafeMapRoute { }