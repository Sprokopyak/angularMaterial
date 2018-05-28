import { ActivatedRoute } from "@angular/router";
import { ElementRef, NgZone, OnInit, ViewChild, Component } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";

import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: "app-add-cafe",
  templateUrl: "./add-cafe.component.html",
  styleUrls: ["./add-cafe.component.scss"]
})
export class AddCafe implements OnInit {
  selectable: boolean = true;
  removable: boolean = true;
  public tablesForm: FormGroup;

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;

  @ViewChild("search") public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, public fb: FormBuilder) {
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

  cafeTypes = [
    { value: "bar", viewValue: "Бар" },
    { value: "cafe", viewValue: "Кафе" },
    { value: "coffeShop", viewValue: "Кав'ярня" },
    { value: "restaurant", viewValue: "Ресторан" },
    { value: "pub", viewValue: "Паб" },
    { value: "hookah", viewValue: "Кальянна" },
    { value: "nightClub", viewValue: "Нічний клуб" }
  ];

  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];

  get tablesNumber() {
    return this.tablesForm.get('tablesNumber')
  }
  get visitorsNumber() {
    return this.tablesForm.get('visitorsNumber')
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      console.log(   this.tablesForm.getRawValue());
      this.fruits.push({ name: value });
    }
    console.log(this.fruits)

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
