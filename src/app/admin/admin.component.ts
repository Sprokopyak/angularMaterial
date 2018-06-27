import { Component, OnInit } from '@angular/core';
import { CafeService } from '../core/cafe-service/cafe.service';
import { Observable, Subject, combineLatest, empty } from 'rxjs';
import { CAFE_TYPES } from '../cafe/constants';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ConfirmDialog } from '../commons/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef  } from '@angular/material';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class Admin implements OnInit {
  startAt = new Subject();
  endAt = new Subject();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  notApprovedCafes: Observable<any>;
  cafe;
  cafeTypes = CAFE_TYPES;
  dialogRef: MatDialogRef<ConfirmDialog>;
  searchCafes: Observable<any[]>;

  constructor(
    private _cafeService: CafeService,
    private _dialog: MatDialog) { }

  search($event) {
    let query = $event.target.value.toLowerCase();
    if (query !== '') {
      this.startAt.next(query);
      this.endAt.next(query + '\uf8ff');
    } else {
      this.searchCafes = empty() 
    }
  }

  ngOnInit() {
    combineLatest(this.startAt, this.endAt).subscribe(value => {
      this.searchCafes = this._cafeService.searchCafe(value[0], value[1]);
    });

    this.notApprovedCafes = this._cafeService.getCafeList();
    
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
  }

  cafeDetails(cafe) {
    this.cafe = cafe;
    
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

  approveCafe(cafe){
    cafe.approved = true;
    this._cafeService.updateCafe(cafe)
    .then(()=>this.cafe = '');
  }

  deleteCafe(cafe){
    this.dialogRef = this._dialog.open(ConfirmDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = `Ви справді хочете видалити заклад ${cafe.cafeName}?`

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this._cafeService.deleteCafe(cafe.id)
        .then(()=>this.cafe = '');
      }
      this.dialogRef = null;
    });
  }
}