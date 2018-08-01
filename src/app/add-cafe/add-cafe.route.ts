import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { AddCafe } from './add-cafe.component';

const routes: Routes = [
  { path: '', component: AddCafe }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AddCafeRoute { }