import { Routes, RouterModule } from '@angular/router';

import { Home } from './home/home.component';
import { SignUp } from './login/sign-up/sign-up.component';
import { SignIn } from './login/sign-in/sign-in.component';

import { LoginGuard } from './core/login-guard/login.guard';

export const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: Home
  }, {
    path: 'sign-up',
    component: SignUp,
    canActivate: [LoginGuard]
  }, {
    path: 'sign-in',
    component: SignIn,
    canActivate: [LoginGuard]
  }, {
    path: '**',
    redirectTo: 'home'
  }
]);