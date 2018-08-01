import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { Admin } from './admin.component';

const routes: Routes = [
  { path: '', component: Admin }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AdminRoute { }