import { ActivatedRoute } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CafeService } from '../../core/cafe-service/cafe.service';
import { CAFE_TYPES } from '../constants';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { AuthService } from '../../core/auth-service/auth.service';
import { UserService } from '../../core/user-service/user.service';
import { User } from '../../core/models/user.model';
import { ImageUploadService } from '../../core/image-upload/image-upload.service';
import { Upload } from '../../core/models/image-upload.model';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';
import { PhoneNumberDialog } from '../../commons/phone-number-dialog/phone-number-dialog.component'

import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cafe-details',
  templateUrl: './cafe-details.component.html',
  styleUrls: ['./cafe-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CafeDetails implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  cafeTypes = CAFE_TYPES;
  cafe;
  cafes;
  cafeId;
  subscribtion;
  displayedColumns = ['visitors', 'name', 'reserved', 'freeTables', 'reserve'];
  user: User;
  subscription;
  progress$: Observable<number>;

  userReservedCafe;
  currentUpload: Upload;
  userBooked= [];

  constructor(
    public imageUploadService: ImageUploadService,
    private _cafeService: CafeService,
    private _authService: AuthService,
    private _userService: UserService, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog) {
      this.progress$ = this.imageUploadService.uploading$;

      this.imageUploadService.completed$.subscribe((upload) => {
        this.currentUpload = upload;          
        this.cafe.mainImgSrc = {
          url: this.currentUpload.url,
          fullPath: this.currentUpload.fullPath,
          thumbnailUrl: this.currentUpload.thumbnailUrl,
          thumbnailPath: this.currentUpload.thumbnailPath
        }
        this._cafeService.updateCafe(this.cafe)     
      });

      this.imageUploadService.completedMulti$.subscribe((upload) => {
        this.currentUpload = upload;
        this.pushIfNew(this.cafe.gallery, {
          url: this.currentUpload.url,
          fullPath: this.currentUpload.fullPath,
          thumbnailUrl: this.currentUpload.thumbnailUrl,
          thumbnailPath: this.currentUpload.thumbnailPath
        });  
        this._cafeService.updateCafe(this.cafe)        
    });
      
    }

    pushIfNew(array,  obj) {
      if (!array.find(val => val.fullPath === obj.fullPath)){
        array.push(obj);
      }
    }

    openAddPhoneNumberDialog() {
      this._dialog.open(PhoneNumberDialog, {
        width: '450px'
      })
      .afterClosed().subscribe(phoneNumber => {
        if(phoneNumber){
          this.user.phoneNumber = parseInt(phoneNumber)
          this._userService.updateUser(this.user)
          .then(()=>{
            this.showMessageDialog('Тепер ви можете забронювати будь-який вільний столик')
          })
        }
      });      
    }

    showMessageDialog(message: string): void {
      this._dialog.open(MessageDialog, {
        width: '450px',
        data: message
      });
    }

  ngOnInit() {
    this.galleryOptions = [{
      imageArrowsAutoHide: true,
      thumbnailsArrowsAutoHide: true,
      width: '600px',
      height: '400px',
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide
    }, {
      breakpoint: 800,
      width: '100%',
      height: '600px',
      imagePercent: 80,
      thumbnailsPercent: 20
    }, {
      breakpoint: 400,
      preview: false
    }];

    this._route.params.subscribe(param => {
      this.cafeId = param.id;
      this.subscribtion = this._cafeService.getCafe(this.cafeId).subscribe(cafe => {
        console.log(cafe);
        this.cafe = cafe;
        this.cafe.tables.sort((a,b)=> a.visitorsNumber > b.visitorsNumber);
        this.galleryImages = this.cafe.gallery.map(val => {
          return {
            small: val.thumbnailUrl,
            medium: val.thumbnailUrl,
            big: val.url,
          }
        })
        this.galleryImages.unshift({
          small: this.cafe.mainImgSrc.thumbnailUrl,
          medium: this.cafe.mainImgSrc.thumbnailUrl,
          big: this.cafe.mainImgSrc.url,
        })
      })
    });
    this.cafes = this._cafeService.getCafes();

    this.subscription = this._authService.user.subscribe(val => {
      this.user = val;
      if(this.user.reserved.cafeId !== '' && this.user.reserved.reservedTime !== ''){
        this._cafeService.getCafe(this.user.reserved.cafeId).subscribe(cafe => {
          this.userReservedCafe = cafe        
        })
      } 
    });
  }

  unbook(tableArr){
    tableArr.forEach(val => {
      let indexOfUserId = val.users.indexOf(this.user.uid)
      if(val.users.indexOf(this.user.uid) !== -1){
        val.users.splice(indexOfUserId, 1);
        let indexOfTableUserBooked = tableArr.indexOf(val)
        tableArr[indexOfTableUserBooked].booked -= 1;        
      }
      this._userService.userBooking(this.user.uid, null, false, null, null)
      this._cafeService.updateCafe(this.userReservedCafe)
    });
  }

  book(tableObj, tablesNumber, booked) {
    if(!this.user.phoneNumber){
      this.openAddPhoneNumberDialog(); 
    } else{   
      let indexOfTableObj = this.cafe.tables.indexOf(tableObj);
      if (booked < tablesNumber) {
        this.cafe.tables[indexOfTableObj].booked += 1;

        this.cafe.tables[indexOfTableObj].users.indexOf(this.user.uid) === -1 
        ? this.cafe.tables[indexOfTableObj].users.push(this.user.uid) 
        : console.log('This user already exists');
        let reservationTime = new Date()
        let reservationValidTill = new Date()
        reservationValidTill.setMinutes(reservationTime.getMinutes()+30)      
        this._userService.userBooking(this.user.uid, this.cafe.id, false, reservationTime.toString(), reservationValidTill.toString());
        this._cafeService.updateCafe(this.cafe);
      }
    }
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

  ngOnDestroy() {
    this.subscribtion.unsubscribe()
  }

  uploadSingle(event) {
    if(this.cafe.mainImgSrc !== ''){
      this.showMessageDialog('Спочатку видаліть старе фото закладу');
    } else{
      this.imageUploadService.uploadSingle(event);
    }   
  }

  uploadMulti(event) {
    this.imageUploadService.uploadMulti(event);
  }

  removeGalleryImg(img) {
    this.imageUploadService.removeImg(img.fullPath, img.thumbnailPath);
    let index = this.cafe.gallery.indexOf(img);
    this.cafe.gallery = this.cafe.gallery.filter((el, i) => i !== index);
    this._cafeService.updateCafe(this.cafe);
  }
  
  saveDescription(val){
    this.cafe.description = val;
    this._cafeService.updateCafe(this.cafe);
  }

  removeTable(table){
    let index = this.cafe.tables.indexOf(table);  
    this.cafe.tables = this.cafe.tables.filter((el, i) => i !== index);
    this.cafe.freeTables -= parseInt(table.tablesNumber);
    this._cafeService.updateCafe(this.cafe);
  }

  onAddTables(tablesNumber, visitorsNumber) {   
    if (tablesNumber.value !== '' && visitorsNumber.value !== '') {
      this.cafe.tables.push({ 
        tablesNumber: parseInt(tablesNumber.value), 
        visitorsNumber: parseInt(visitorsNumber.value), 
        booked: 0,
        users: [] 
      });
      this.cafe.tables.sort((a,b)=> a.visitorsNumber > b.visitorsNumber);
      this.cafe.freeTables += parseInt(tablesNumber.value);
      tablesNumber.value = '';
      visitorsNumber.value = '';
      this._cafeService.updateCafe(this.cafe);
    }
  }

  users(arr){    
    this.userBooked = []
    arr.users.forEach(usersId=>{    
      this._userService.getUser(usersId).subscribe(user=>{
        if (!this.userBooked.find(val => val.uid === usersId)){
          this.userBooked.push(...user)
        }
      })
    })
  }

  dateFormat(date){
    return new Date(date).toLocaleString();
  }

  approveReservation(user){
    user.reserved.approvedBoking = true;
    this._userService.approveReservation(user)
  }

  unbookTable(userId, tableArr){
    tableArr.forEach(val => {
      let indexOfUserId = val.users.indexOf(userId)
      if(indexOfUserId !== -1){
        val.users.splice(indexOfUserId, 1);
        let indexOfTableUserBooked = tableArr.indexOf(val)
        tableArr[indexOfTableUserBooked].booked -= 1;        
      }
      this._userService.userBooking(userId, null, false, null, null)
      this._cafeService.updateCafe(this.cafe)
    });    
  }
}