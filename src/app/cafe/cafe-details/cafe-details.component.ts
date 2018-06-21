import { ActivatedRoute } from '@angular/router';
import { OnInit, Component } from '@angular/core';

import { CafeService } from '../../core/cafe-service/cafe.service';
import { CAFE_TYPES } from '../constants';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import { AuthService } from '../../core/auth-service/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-cafe-details',
  templateUrl: './cafe-details.component.html',
  styleUrls: ['./cafe-details.component.scss']
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

  constructor(
    private _cafeService: CafeService,
    private _authService: AuthService, 
    private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this._authService.user.subscribe(val => {
      this.user = val;
    });

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
    this.cafes = this._cafeService.getCafes()
  }

  book(obj, tablesNumber, booked) {    
    let index = this.cafe.tables.indexOf(obj);
    if (booked < tablesNumber) {
      this.cafe.tables[index].booked += 1;
      this.cafe.tables[index].users.indexOf(this.user.uid) === -1 
      ? this.cafe.tables[index].users.push(this.user.uid) : console.log("This user already exists");
      
       console.log(this.user);
       this._cafeService.getCafe(this.user.reserved.cafeId).subscribe(val=>{
       let index = this.user.reserved.tableIndex
       let a = val['tables'][index].users
       
        console.log(a);
        
      })
      
      // this._authService.updateUser(this.user.uid, this.cafe.id, index)
      // this._cafeService.updateCafe(this.cafe)
    } else {
      console.log('no free tables');
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
}