import { ActivatedRoute } from "@angular/router";
import { ElementRef, NgZone, OnInit, ViewChild, Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { } from "googlemaps";
import { MapsAPILoader } from "@agm/core";

import { ImageUploadService } from '../../core/image-upload/image-upload.service';
import { Upload } from '../../core/models/image-upload.model';

import { Observable } from 'rxjs';
import { CAFE_TYPES } from '../constants';

@Component({
  selector: "app-add-cafe",
  templateUrl: "./add-cafe.component.html",
  styleUrls: ["./add-cafe.component.scss"]
})
export class AddCafe implements OnInit {
  addCafeForm: FormGroup;
  cafeTypes = CAFE_TYPES;
  latitude: number;
  longitude: number;
  tables = [];
  currentUpload: Upload;
  mainImgSrc: object;
  gallery = [];
  progress$: Observable<number>;

  @ViewChild('search') public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone, 
    public fb: FormBuilder,
    private _imageUploadService: ImageUploadService
  ) {
      this.progress$ = this._imageUploadService.uploading$;
      this._imageUploadService.completed$.subscribe((upload) => {
        if (upload) {          
          this.currentUpload = upload;          
          this.mainImgSrc = {
            url: this.currentUpload.url,
            fullPath: this.currentUpload.fullPath,
            thumbnailUrl: this.currentUpload.thumbnailUrl,
            thumbnailPath: this.currentUpload.thumbnailPath
          }           
        } 
      });
     
      this._imageUploadService.completedMulti$.subscribe((upload) => {
        if (upload) {          
          this.currentUpload = upload;
          this.pushIfNew(this.gallery, {
            url: this.currentUpload.url,
            fullPath: this.currentUpload.fullPath,
            thumbnailUrl: this.currentUpload.thumbnailUrl,
            thumbnailPath: this.currentUpload.thumbnailPath
          });       
        } 
      });

    this.addCafeForm = this.fb.group({
      'cafeName': ['', [Validators.required, Validators.minLength(2)]],
      'cafeType': ['', [Validators.required]],
      'searchControl': ['', [Validators.required]],
      'description': ['', [Validators.required, Validators.minLength(10)]]
    });
  }

   pushIfNew(array,  obj) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].fullPath === obj.fullPath) { 
        return;
      }
    }    
    array.push(obj);
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement, {
          types: ["address"]
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
        });
      });
    });
  }

  uploadSingle(event) {
    this._imageUploadService.uploadSingle(event);
  }

  uploadMulti(event) {
    this._imageUploadService.uploadMulti(event);
  }

  onAddTables(tablesNumber, visitorsNumber) {
    if (tablesNumber.value !== '' && visitorsNumber.value !== '') {
      let arr = new Array(parseInt(tablesNumber.value));      
      arr.fill({booked: false, visitorsNumber: parseInt(visitorsNumber.value)})

      this.tables.push({ tablesNumber: parseInt(tablesNumber.value), visitorsNumber: parseInt(visitorsNumber.value), freeTables: arr })
      console.log(this.tables)
      tablesNumber.value = '';
      visitorsNumber.value = '';
    }
  }

  removeGalleryImg(img): void {
    this._imageUploadService.removeImg(img.fullPath, img.thumbnailPath);
    let index = this.gallery.indexOf(img);  
    if (index >= 0) {
      this.gallery.splice(index, 1);
    }
  }

  removeTables(table: any): void {
    let index = this.tables.indexOf(table);  
    if (index >= 0) {
      this.tables.splice(index, 1);
    }
  }

  addCafe(){
    let formsVlue = this.addCafeForm.getRawValue();
    let obj = {
      mainImgSrc: this.mainImgSrc,
      gallery: this.gallery,
      cafeName: formsVlue.cafeName,
      cafeType: formsVlue.cafeType,
      location: {
        latitude: this.latitude, 
        longitude: this.longitude
      },
      tables: this.tables,
      description: formsVlue.description
    }
    console.log(obj);
    
  }
}
