import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth-service/auth.service';
import { User } from '../core/models/user.model';
import { UserService } from '../core/user-service/user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  uid;
  constructor(private _route: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router,
    private _userService: UserService) {
  }

  ngOnInit() {
    this._route.params.subscribe(param => {
      this.uid = param.id
      this._authService.user.subscribe(user => {
        if (param.id === user.uid) {
          this.user = user;

          console.log(user);

        } else {
          this._router.navigate(['/home'])
        }
      });
    })
    if (this.uid) {
      this._userService.getUserStars(this.uid).subscribe(val => {
        console.log(val);

      })
    }




  }


}