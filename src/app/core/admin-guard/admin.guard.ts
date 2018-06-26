import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private _auth: AuthService, private _router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this._auth.user.pipe(
      take(1),
      map(users => this._auth.isLogedIn && users.role === 'admin'),
      tap(isAdmin => {
        if (!isAdmin) {
          console.error('Access denied - Admins only')
          this._router.navigate(['/home']);
        }
      })
    )
  }
}