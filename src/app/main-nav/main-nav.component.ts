import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth-service/auth.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})

export class MainNavComponent implements OnInit {
  user: User;
  isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

  constructor(
    public authService: AuthService,
    private _breakpointObserver: BreakpointObserver) {
  }

  ngOnInit() {
    this.authService.user.subscribe(val => {
      this.user = val;
    });
  }
}
