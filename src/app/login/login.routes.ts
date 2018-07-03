import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUp } from './sign-up/sign-up.component';
import { SignIn } from './sign-in/sign-in.component';
import { LoginGuard } from '../core/login-guard/login.guard';

const routes: Routes = [{
    path: 'sign-up',
    component: SignUp,
    canActivate: [LoginGuard]
  }, {
    path: 'sign-in',
    component: SignIn,
    canActivate: [LoginGuard]
  }];

export const LoginRoutes: ModuleWithProviders = RouterModule.forChild(routes);