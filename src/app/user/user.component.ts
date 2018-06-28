import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth-service/auth.service';
import { User } from '../core/models/user.model';
import { UserService } from '../core/user-service/user.service';
import { CafeService } from '../core/cafe-service/cafe.service';
import { Star } from '../core/models/rating.model';

import { ConfirmDialog } from '../commons/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef  } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  uid;
  visitedCafe = [];
  userReservedCafe;
  selectedCafe =[];
  dialogRef: MatDialogRef<ConfirmDialog>;
  
  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router,
    private _userService: UserService,
    private _cafeService: CafeService,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this._route.params.subscribe(param => {
      this.uid = param.id;
      this._authService.user.subscribe(user => {
        if (param.id === user.uid) {
          this.user = user;
          if(this.user.reserved.cafeId !== '' && this.user.reserved.reservedTime !== ''){
            this._cafeService.getCafe(this.user.reserved.cafeId).subscribe(cafe => {
              this.userReservedCafe = cafe        
            })
          }
          if(this.user.selectedCafes.length !==0){
            this.user.selectedCafes.forEach(cafeId=>{
              this._cafeService.getCafe(cafeId).subscribe(cafe => {
                if (!this.selectedCafe.find(val => val.id === cafeId)){
                  this.selectedCafe.push(cafe)
                }
              })
            })
          } 
        } else {
          this._router.navigate(['/home']);
        }
      });
    });
    if (this.uid) {
      this._userService.getUserStars(this.uid).subscribe(arr => {
        arr.forEach((obj: Star) => {
          this._cafeService.getCafe(obj.cafeId).subscribe(cafe => {
            if (!this.visitedCafe.find(val => val.id === obj.cafeId)){
              this.visitedCafe.push(cafe);
            }
          });
        });
      });
    }
  }

  unbookCafe(tableArr){
    this.userReservedCafe.freeTables += 1;
    tableArr.forEach(val => {
      const indexOfUserId = val.users.indexOf(this.user.uid)
      if(val.users.indexOf(this.user.uid) !== -1){
        val.users.splice(indexOfUserId, 1);
        const indexOfTableUserBooked = tableArr.indexOf(val)
        tableArr[indexOfTableUserBooked].booked -= 1;        
      }
      this._userService.userBooking(this.user.uid, null, false, null, null, null)
      this._cafeService.updateCafe(this.userReservedCafe)
    });
  }

  removeFormSelected(cafeId){
    const index = this.user.selectedCafes.indexOf(cafeId);
    this.dialogRef = this._dialog.open(ConfirmDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Ви справді хочете видалити цей заклад?'

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.selectedCafe.splice(index, 1);
        this.user.selectedCafes.splice(index, 1);
        this._userService.updateUser(this.user);
      }
      this.dialogRef = null;
    });
  }

}
