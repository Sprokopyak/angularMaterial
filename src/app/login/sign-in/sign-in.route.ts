import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { SignIn } from './sign-in.component';

const routes: Routes = [
  { path: '', component: SignIn }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class SignInRoute { }