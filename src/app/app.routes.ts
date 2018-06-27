import { RouterModule } from '@angular/router';

import { Home } from './home/home.component';
import { UserComponent } from './user/user.component';
import { SignUp } from './login/sign-up/sign-up.component';
import { SignIn } from './login/sign-in/sign-in.component';
import { Admin } from './admin/admin.component';
import { AddCafe } from './cafe/add-cafe/add-cafe.component';
import { CafeDetails } from './cafe/cafe-details/cafe-details.component';

import { AdminGuard } from './core/admin-guard/admin.guard';
import { LoginGuard } from './core/login-guard/login.guard';

export const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: Home
  }, {
    path: 'user/:id',
    component: UserComponent
  }, {
    path: 'sign-up',
    component: SignUp,
    canActivate: [LoginGuard]
  }, {
    path: 'sign-in',
    component: SignIn,
    canActivate: [LoginGuard]
  }, {
    path: 'admin',
    component: Admin,
    canActivate: [AdminGuard]
  }, {
    path: 'add-cafe',
    component: AddCafe
  }, {
    path: 'cafe/:id',
    component: CafeDetails
  }, {
    path: '**',
    redirectTo: 'home'
  }
]);