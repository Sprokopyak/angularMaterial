import { Component, OnInit, Input } from '@angular/core';
import { RatingService } from '../../core/rating-service/rating.service';

import { AuthService } from '../../core/auth-service/auth.service';
import { User } from '../../core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() cafeId;
  @Input() cafeRating;
  user: User;
  subscription;
  avRating;
  commentsForm: FormGroup;
  comments = [];

  constructor(
    private _ratingService: RatingService,
    private _authService: AuthService,
    private _fb: FormBuilder) {
      this.commentsForm = this._fb.group({
        username: ['', [Validators.required, Validators.minLength(2)]],
        comment: ['', [Validators.required,  Validators.minLength(10)]]
      });
    }

  ngOnInit() {
    this.subscription = this._authService.user.subscribe(val => {
      this.user = val;
    });

    if(this.cafeId){
      this._ratingService.getCafeComments(this.cafeId).subscribe((data) => {
        this.comments = data;
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submitComment() {
    this._ratingService.postComments(this.commentsForm.value, this.cafeId)
    .then(()=>this.commentsForm.reset());
    if(this.avRating){
      this._ratingService.setCafeRating(this.cafeId, parseFloat(this.avRating.toFixed(1)));
    }
  }

  pushRating(val) {
    this._ratingService.postRating({
      userId: this.user.uid,
      cafeId: this.cafeId,
      ratingValue: val
    });

    this._ratingService.getCafeRating(this.cafeId).subscribe(retVal => {
      const ratings = retVal.map(v => v['ratingValue']);
      this.avRating = ratings.length
        ? ratings.reduce((total, val) => total + val) / retVal.length
        : 0;
    });
  }
}
