import { Routes, RouterModule } from '@angular/router';

import { Home } from './home/home.component';

export const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: Home
  }, {
    path: '**',
    redirectTo: 'home'
  }
]);