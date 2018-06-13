import { Component, OnInit, Input } from "@angular/core";
import { RatingService } from "../core/rating-service/rating.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.scss"]
})
export class RatingComponent implements OnInit {
  @Input() userId;
  @Input() cafeId;

  stars: Observable<any>;
  avgRating: Observable<any>;

  constructor(private _ratingService: RatingService) {}

  ngOnInit() {
    this.stars = this._ratingService.getCafeStars(this.cafeId);
console.log(this.cafeId);

    this.avgRating = this.stars.pipe(
      map(arr => {
        const ratings = arr.map(v => v.value);
        return ratings.length
          ? ratings.reduce((total, val) => total + val) / arr.length
          : "not reviewed";
      })
    );
  }

  starHandler(value) {
    this._ratingService.setStar(this.userId, this.cafeId, value);
  }
}
