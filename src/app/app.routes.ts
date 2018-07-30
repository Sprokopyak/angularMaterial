import { RouterModule } from '@angular/router';

import { Home } from './home/home.component';
import { AdminGuard } from './core/admin-guard/admin.guard';
import { LoginGuard } from './core/login-guard/login.guard';

export const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: Home
  }, {
    path: 'sign-up',
    loadChildren: './login/sign-up/sign-up.module#SignUpModule',
    canActivate: [LoginGuard]
  }, {
    path: 'sign-in',
    loadChildren: './login/sign-in/sign-in.module#SignInModule',
    canActivate: [LoginGuard]
  }, {
    path: 'user/:id',
    loadChildren: './user/user.module#UserModule'
  }, {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AdminGuard]
  }, {
    path: 'add-cafe',
    loadChildren: './add-cafe/add-cafe.module#AddCafeModule'
  }, {
    path: 'cafe/:id',
    loadChildren: './cafe/cafe-details/cafe-details.module#CafeDetailsModule'
  }, {
    path: 'map',
    loadChildren: './cafe-map/cafe-map.module#CafeMapModule'
  }, {
    path: '**',
    redirectTo: 'home'
  }
]);