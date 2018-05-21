import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.auth.user.pipe(
      take(1),
      map(users => !this.auth.isLogedIn),
      tap(isLogedIn => {
        if (!isLogedIn) {
          console.error('Access denied')
          this.router.navigate(['/home']);
        }
      })
    )
  }
}