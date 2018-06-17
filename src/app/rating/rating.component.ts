import { Component, OnInit, Input } from "@angular/core";
import { RatingService } from "../core/rating-service/rating.service";

import { AuthService } from "../core/auth-service/auth.service";
import { User } from "../core/models/user.model";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.scss"]
})
export class RatingComponent implements OnInit {
  @Input() cafeId;
  user: User;
  subscription;

  constructor(private _ratingService: RatingService,
    private _authService: AuthService,) {}

  ngOnInit() {
    this.subscription = this._authService.user.subscribe(val => {
      this.user = val;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  pushRating(val) {        
    this._ratingService.postRating({
      userId: this.user.uid,
      cafeId: this.cafeId,
      ratingValue: val
    });

    this._ratingService.getCafeRating(this.cafeId).subscribe(retVal => {
      const ratings = retVal.map(v => v["ratingValue"]);
      let avRating = ratings.length
        ? ratings.reduce((total, val) => total + val) / retVal.length
        : 0;
      this._ratingService.setCafeRating(this.cafeId, parseFloat(avRating.toFixed(1)));
    });
  }
}
