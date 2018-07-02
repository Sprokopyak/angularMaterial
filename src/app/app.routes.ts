import { RouterModule } from '@angular/router';

import { Home } from './home/home.component';
import { UserComponent } from './user/user.component';
import { Admin } from './admin/admin.component';
import { AddCafe } from './cafe/add-cafe/add-cafe.component';
import { CafeDetails } from './cafe/cafe-details/cafe-details.component';
import { CafeMap } from './cafe-map/cafe-map.component';
import { AdminGuard } from './core/admin-guard/admin.guard';

export const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: Home
  }, {
    path: 'user/:id',
    component: UserComponent
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
  },{
    path: 'map',
    component: CafeMap
  },{
    path: 'sign-in',
    loadChildren: '../app/login/login.module#LoginModule'
  }, {
    path: '**',
    redirectTo: 'home'
  }
]);