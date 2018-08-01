import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { SignUp } from './sign-up.component';

const routes: Routes = [
  { path: '', component: SignUp }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class SignUpRoute { }