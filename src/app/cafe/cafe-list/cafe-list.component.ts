import { Component, Input, OnInit } from '@angular/core';
import { CAFE_TYPES } from '../constants';
import { AuthService } from '../../core/auth-service/auth.service';
import { UserService } from '../../core/user-service/user.service';
import { User } from '../../core/models/user.model';
import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Component({
  selector: 'app-cafe-list',
  templateUrl: './cafe-list.component.html',
  styleUrls: ['./cafe-list.component.scss']
})
export class CafeList implements OnInit {
  @Input('cafe') cafe;
  cafeTypes = CAFE_TYPES;
  user;
  subscription;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _dialog: MatDialog
  ) {}

  showMessageDialog(message: string): void {
    this._dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  getCafetype(type) {
    let typeName;
    this.cafeTypes.forEach(val => {
      if (val.value === type) {
        typeName = val.viewValue;
      }
    });
    return typeName;
  }

  ngOnInit() {    
   this.subscription = this._authService.user.subscribe((user: User) => {
      this.user = user;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  toSelected(cafeId, cafeName) {
    if (!this.user.selectedCafes.find(val => val === cafeId)) {
      this.user.selectedCafes.push(cafeId);
      this._userService.updateUser(this.user)
      .then(()=>{
        this.showMessageDialog(`Заклад ${cafeName} додано до списку обраних`);
      })
    } else {
      this.showMessageDialog('Ви вже додали цей заклад в список обраних');
    }
  }
}
