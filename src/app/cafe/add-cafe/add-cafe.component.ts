import { ActivatedRoute } from "@angular/router";
import { ElementRef, NgZone, OnInit, ViewChild, Component } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { } from "googlemaps";
import { MapsAPILoader } from "@agm/core";

import { ImageUploadService } from '../../core/image-upload/image-upload.service';
import { Upload } from '../../core/models/image-upload.model';

import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';

import * as _ from "lodash";

@Component({
  selector: "app-add-cafe",
  templateUrl: "./add-cafe.component.html",
  styleUrls: ["./add-cafe.component.scss"]
})
export class AddCafe implements OnInit {
  public tablesForm: FormGroup;

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  private _selectedImages = [];
  tables = [];
  selectedFiles: FileList;
  currentUpload: Upload;
  imgSrc;
  imgSrcGallery;
  gallery = [];
  progress$: Observable<number>;

  private cafeTypes = [
    { value: 'bar', viewValue: 'Бар' },
    { value: 'cafe', viewValue: 'Кафе' },
    { value: 'coffeShop', viewValue: 'Кав\'ярня' },
    { value: 'restaurant', viewValue: 'Ресторан' },
    { value: 'pub', viewValue: 'Паб' },
    { value: 'hookah', viewValue: 'Кальянна' },
    { value: 'nightClub', viewValue: 'Нічний клуб' }
  ];

  @ViewChild('search') public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone, 
    public fb: FormBuilder,
    private _imageUploadService: ImageUploadService, 
    private afs: AngularFireStorage
  ) {
      this.progress$ = this._imageUploadService.uploading$;
      this._imageUploadService.completed$.subscribe((upload) => {
        if (upload) {          
          this.currentUpload = upload;
          this.imgSrc = this.currentUpload.url;
        } else {
          this.currentUpload = null;
        }
      });

      this._imageUploadService.completedMulti$.subscribe((upload) => {
        if (upload) {          
          this.currentUpload = upload;
          this.gallery.push(this.currentUpload.url);
          console.log( this.gallery);
          // this.anyService.uploadFormData({....}).subscribe(() => {
          //   console.log('done');
          // });
        } else {
          this.currentUpload = null;
        }
      });

    this.tablesForm = this.fb.group({
      'tablesNumber': ['', [Validators.required]],
      'visitorsNumber': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.searchControl = new FormControl();

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
          console.log(this.latitude, this.longitude);
        });
      });
    });
  }

  uploadSingle(event) {
    this._imageUploadService.uploadSingle(event)
  }

  selectFiles(event) {
    this.selectedFiles = event.target.files;
    let files = this.selectedFiles;
    let filesIndex = _.range(files.length)
    _.each(filesIndex, (idx) => {
      this._selectedImages.push( files[idx])
    })
    // console.log(this.selectedImages);
  }

   uploadMulti() {
    let files = this.selectedFiles;
    let uniqkey = 'cafe' + new Date().getTime();
 

    this._selectedImages.forEach((val)=>{
      this.currentUpload = new Upload(val);
      this._imageUploadService.uploadMulti(this.currentUpload, uniqkey)
    })
  }

  onAddTables(tablesNumber, visitorsNumber) {
    if (tablesNumber.value !== '' && visitorsNumber.value !== '') {
      this.tables.push({ tablesNumber: tablesNumber.value, visitorsNumber: visitorsNumber.value })
      console.log(this.tables)
      tablesNumber.value = '';
      visitorsNumber.value = '';
    }
  }

  removeImg(img: any): void {
    let index = this._selectedImages.indexOf(img);  
    if (index >= 0) {
      this._selectedImages.splice(index, 1);
    }
  }

  remove(table: any): void {
    let index = this.tables.indexOf(table);  
    if (index >= 0) {
      this.tables.splice(index, 1);
    }
  }

  // send(){
   
  //   this.uploadMulti()
  //   .then((val)=>{
  //     console.log(val);
      
  //     console.log( this.gallery);
      
  //   })
  // }
}
