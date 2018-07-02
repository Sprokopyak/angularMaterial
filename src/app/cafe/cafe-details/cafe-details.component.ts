import { ActivatedRoute } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { User } from '../../core/models/user.model';
import { Upload } from '../../core/models/image-upload.model';
import { CafeService } from '../../core/cafe-service/cafe.service';
import { AuthService } from '../../core/auth-service/auth.service';
import { UserService } from '../../core/user-service/user.service';
import { ImageUploadService } from '../../core/image-upload/image-upload.service';

import { CAFE_TYPES } from '../constants';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';
import { PhoneNumberDialog } from '../../commons/phone-number-dialog/phone-number-dialog.component';

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
  displayedColumns = ['visitors', 'name', 'booked', 'freeTables', 'reserve', 'reserves'];
  user: User;
  subscription;
  progress$: Observable<number>;
  currentUpload: Upload;
  userBooked: Observable<any>;
  editCafe: boolean;
  editDesciption: boolean;

  constructor(
    public imageUploadService: ImageUploadService,
    public authService: AuthService,
    private _cafeService: CafeService,
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
      width: '100%',
      height: '400px',
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide
    }, {
      breakpoint: 430,
      height: '300px',
      preview: false
    },{
      breakpoint: 340,
      height: '250px'
    }];

    this._route.params.subscribe(param => {
      this.cafeId = param.id;
      this.subscription = this._cafeService.getCafe(this.cafeId).subscribe(cafe => {
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

    this.authService.user.subscribe(val => {
      this.user = val;
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  bookAdminTable(tableObj, tablesNumber, booked){
    let indexOfTableObj = this.cafe.tables.indexOf(tableObj);
    if (booked < tablesNumber) {
      this.cafe.tables[indexOfTableObj].booked += 1;
      this.cafe.freeTables -= 1;
      this._cafeService.updateCafe(this.cafe);
    }
  }

  unBookAdminTable(tableObj){
    let indexOfTableObj = this.cafe.tables.indexOf(tableObj);
      this.cafe.tables[indexOfTableObj].booked -= 1;
      this.cafe.freeTables += 1;
      this._cafeService.updateCafe(this.cafe);
  }

  bookTable(tableObj, tablesNumber, booked) {
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
        this._userService.userBooking(this.user.uid, this.cafe.id, false, reservationTime.toLocaleString(), reservationValidTill.toLocaleString(), tableObj.visitorsNumber);
        this.cafe.freeTables -= 1;
        this._cafeService.updateCafe(this.cafe);
      }
    }
  }

  unbookTable(userId, tableArr){
    this.cafe.freeTables += 1;
    tableArr.forEach(val => {
      let indexOfUserId = val.users.indexOf(userId)
      if(indexOfUserId !== -1){
        val.users.splice(indexOfUserId, 1);
        let indexOfTableUserBooked = tableArr.indexOf(val)
        tableArr[indexOfTableUserBooked].booked -= 1;        
      }
      this._userService.userBooking(userId, null, false, null, null, null)
      this._cafeService.updateCafe(this.cafe)
    });    
  }

  uploadSingleImg(event) {
    if(this.cafe.mainImgSrc !== ''){
      this.showMessageDialog('Спочатку видаліть старе фото закладу');
    } else{
      this.imageUploadService.uploadSingle(event);
    }   
  }

  removeSingleImg(cafe, fullPath, thumbnailPath){
    cafe.mainImgSrc = '';
    this.imageUploadService.removeImg(fullPath, thumbnailPath);
    this._cafeService.updateCafe(cafe)
  }

  uploadMultiImg(event) {
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

  showUsersBookedTable(arr){
    const observables = arr.users.map(usersId => this._userService.getUser(usersId));
    this.userBooked = combineLatest(observables);
  }

  approveReservation(user){
    user.reserved.approvedBoking = true;
    this._userService.approveReservation(user)
  }
}