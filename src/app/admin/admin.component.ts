import { Component, OnInit } from '@angular/core';
import { CafeService } from '../core/cafe-service/cafe.service';
import { Observable } from 'rxjs';
import { Cafe } from '../core/models/cafe.model';
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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  notApprovedCafes: Observable<any>;
  cafe;
  cafeTypes = CAFE_TYPES;
  dialogRef: MatDialogRef<ConfirmDialog>;

  constructor(
    private _cafeService: CafeService,
    private _dialog: MatDialog) { }

  ngOnInit() {
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

  deleteCafe(cafe){
    this.dialogRef = this._dialog.open(ConfirmDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = `Ви справді хочете видалити кафе ${cafe.cafeName}?`

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this._cafeService.deleteCafe(cafe.id)
        .then(()=>{
          this.cafe = ''
        })
      }
      this.dialogRef = null;
    });
  }

}