import { Component, OnInit } from "@angular/core";
import { Subject, combineLatest } from "rxjs";
import { CafeService } from "../core/cafe-service/cafe.service";
import { AgmCoreModule, MapsAPILoader } from "@agm/core";
import { CAFE_TYPES } from "./../cafe/constants";

declare var google;
@Component({
  selector: "app-cafe-map",
  templateUrl: "./cafe-map.component.html",
  styleUrls: ["./cafe-map.component.scss"]
})
export class CafeMap implements OnInit {
  lat: number = 49.8498827;
  lng: number = 24.0223092;
  zoom: number = 14;
  userLocation;
  cafes;
  cafeTypes = CAFE_TYPES;
  startAt = new Subject();
  endAt = new Subject();

  constructor(
    private _cafeService: CafeService,
    private _mapsAPILoader: MapsAPILoader
  ) {}

  search($event) {
    let searchQuery = $event.target.value.toLowerCase();
    if (searchQuery !== "") {
      this.startAt.next(searchQuery);
      this.endAt.next(searchQuery + "\uf8ff");
    } else {
      this.cafes = this._cafeService.getCafeList();
    }
  }

  ngOnInit() {
    this.cafes = this._cafeService.getCafeList();
    this._mapsAPILoader.load();

    combineLatest(
      this._cafeService.ratingFilter$,
      this._cafeService.cafeTypeFilter$,
      this._cafeService.freeTablesFilter$
    ).subscribe(() => this.cafes = this._cafeService.filters());

    combineLatest(this.startAt, this.endAt).subscribe(value => {
      this.cafes = this._cafeService.searchCafe(value[0], value[1]);
    });

    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
    } 
  }

  showDistance(lat, lng){
    if(this.userLocation){
      const user = new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng);
      const cafe = new google.maps.LatLng(lat, lng);
      return `${parseFloat(google.maps.geometry.spherical.computeDistanceBetween(user, cafe).toFixed(0))} м. від Вас`; 
    } else{
      return 'увімкніть геолокацію, щоб побачити відстань до кафе, від вашого поточного місезнаходження'
    }
  }

  filterByCafeType(type: string | null) {
    this._cafeService.cafeTypeFilter$.next(type);
  }

  filterByRating(rating: number | null) {
    this._cafeService.ratingFilter$.next(rating);
  }

  filterByFreeTables(freeTables: number | null) {
    this._cafeService.freeTablesFilter$.next(freeTables);
  }
}
