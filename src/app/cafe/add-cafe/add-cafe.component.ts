import { ElementRef, NgZone, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { ImageUploadService } from '../../core/image-upload/image-upload.service';
import { CafeService } from '../../core/cafe-service/cafe.service';
import { Upload } from '../../core/models/image-upload.model';

import { Observable } from 'rxjs';
import { CAFE_TYPES } from '../constants';

@Component({
  selector: 'app-add-cafe',
  templateUrl: './add-cafe.component.html',
  styleUrls: ['./add-cafe.component.scss']
})
export class AddCafe implements OnInit {
  isLoading = false;
  addCafeForm: FormGroup;
  cafeTypes = CAFE_TYPES;
  latitude: number;
  longitude: number;
  tables = [];
  currentUpload: Upload;
  mainImgSrc: object;
  gallery = [];
  progress$: Observable<number>;

  @ViewChild('search') searchElementRef: ElementRef;

  constructor(
    public imageUploadService: ImageUploadService,
    private _mapsAPILoader: MapsAPILoader, 
    private _ngZone: NgZone, 
    private _fb: FormBuilder,
    private _cafeService: CafeService
  ) {
      this.progress$ = this.imageUploadService.uploading$;
      this.imageUploadService.completed$.subscribe((upload) => {          
          this.currentUpload = upload;          
          this.mainImgSrc = {
            url: this.currentUpload.url,
            fullPath: this.currentUpload.fullPath,
            thumbnailUrl: this.currentUpload.thumbnailUrl,
            thumbnailPath: this.currentUpload.thumbnailPath
          }           
      });
     
      this.imageUploadService.completedMulti$.subscribe((upload) => {
          this.currentUpload = upload;
          this.pushIfNew(this.gallery, {
            url: this.currentUpload.url,
            fullPath: this.currentUpload.fullPath,
            thumbnailUrl: this.currentUpload.thumbnailUrl,
            thumbnailPath: this.currentUpload.thumbnailPath
          });       
      });

      this.addCafeForm = this._fb.group({
        cafeName: ['', [Validators.required, Validators.minLength(2)]],
        phoneNumber: ['380', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('[0-9]*')]],
        cafeType: ['', [Validators.required]],
        searchControl: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.minLength(10)]]
      });
  }

   pushIfNew(array,  obj) {
    if (!array.find(val => val.fullPath === obj.fullPath)){
      array.push(obj);
    }
  }

  ngOnInit() {
    this._mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement, {
          types: ['address']
        }
      );

      autocomplete.addListener('place_changed', () => {
        this._ngZone.run(() => {
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
    this.imageUploadService.uploadSingle(event);
  }

  uploadMulti(event) {
    this.imageUploadService.uploadMulti(event);
  }

  onAddTables(tablesNumber, visitorsNumber) {   
    if (tablesNumber.value !== '' && visitorsNumber.value !== '') {

      this.tables.push({ tablesNumber: parseInt(tablesNumber.value), visitorsNumber: parseInt(visitorsNumber.value), booked: 0 });
      tablesNumber.value = '';
      visitorsNumber.value = '';
    }
  }

  removeGalleryImg(img) {
    this.imageUploadService.removeImg(img.fullPath, img.thumbnailPath);
    let index = this.gallery.indexOf(img);
    this.gallery = this.gallery.filter((el, i) => i !== index);
  }

  removeTables(table: any) {
    let index = this.tables.indexOf(table);  
    this.tables = this.tables.filter((el, i) => i !== index);
  }

  addCafe(){
    let freeTables = 0;
    this.tables.forEach(val=>{
      freeTables += val.tablesNumber;
    });
    
    let formsVlue = this.addCafeForm.getRawValue();
    let obj = {
      approved: false,
      mainImgSrc: this.mainImgSrc || '',
      gallery: this.gallery || '',
      cafeName: formsVlue.cafeName.toLowerCase(),
      phoneNumber: parseInt(formsVlue.phoneNumber),
      cafeType: formsVlue.cafeType,
      location: {
        latitude: this.latitude, 
        longitude: this.longitude
      },
      tables: this.tables,
      freeTables: freeTables,
      description: formsVlue.description
    }
    this.isLoading = true;
    this._cafeService.pushCafe(obj)
      .then(()=>{
        this.isLoading = false;
        this.addCafeForm.reset();
        this.mainImgSrc= {};
        this.gallery = [];
        this.tables = [];
      });
  }
}
