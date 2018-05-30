import { ActivatedRoute } from "@angular/router";
import { ElementRef, NgZone, OnInit, ViewChild, Component } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { } from "googlemaps";
import { MapsAPILoader } from "@agm/core";

import { ImageUploadService } from '../../core/image-upload/image-upload.service';
import { Upload } from '../../core/models/image-upload.model';

import { AngularFireStorage } from 'angularfire2/storage';

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

  progressBarValue;
  downloadURL


  selectedFiles: FileList;
  currentUpload: Upload;
  imgSrc;

  @ViewChild("search") public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, public fb: FormBuilder,
    private upSvc: ImageUploadService, private afs: AngularFireStorage) {
    this.tablesForm = this.fb.group({
      'tablesNumber': ['', [Validators.required]],
      'visitorsNumber': ['', [Validators.required]]
    });
  }

  detectFiles(event) {
        this.selectedFiles = event.target.files;

    }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file)
    this.upSvc.pushUpload(this.currentUpload)
  
  }


  upload(event) {
    let file = event.target.files[0];
    let uniqkey = 'pic' + new Date().getTime();

    if (file.type.split('/')[0] !== 'image') {
      console.error('Невірний формат файлу')
      return;
    }

    let ref = this.afs.ref('/uploads/' + uniqkey);
    let task = ref.put(file);
    this.progressBarValue = task.percentageChanges();

    task.then((val) => {
      this.downloadURL = val.downloadURL
      console.log(this.downloadURL)
    })

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

  cafeTypes = [
    { value: "bar", viewValue: "Бар" },
    { value: "cafe", viewValue: "Кафе" },
    { value: "coffeShop", viewValue: "Кав'ярня" },
    { value: "restaurant", viewValue: "Ресторан" },
    { value: "pub", viewValue: "Паб" },
    { value: "hookah", viewValue: "Кальянна" },
    { value: "nightClub", viewValue: "Нічний клуб" }
  ];

  tables = [
    { tablesNumber: 1, visitorsNumber: 5 },
    { tablesNumber: 4, visitorsNumber: 2 },
    { tablesNumber: 3, visitorsNumber: 4 },
  ];

  onAdd(tablesNumber, visitorsNumber) {
    if (tablesNumber.value !== '' && visitorsNumber.value !== '') {
      this.tables.push({ tablesNumber: tablesNumber.value, visitorsNumber: visitorsNumber.value })
      console.log(this.tables)
      tablesNumber.value = '';
      visitorsNumber.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.tables.indexOf(fruit);
    if (index >= 0) {
      this.tables.splice(index, 1);
    }
  }
}
