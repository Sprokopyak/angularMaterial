import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../core/auth-service/auth.service";
import { CafeService } from "../core/cafe-service/cafe.service";
import { Cafe } from "../core/models/cafe.model";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class Home implements OnInit {
  cafes: Cafe[];
  private subscription;

  constructor(
    private _authService: AuthService,
    private _cafeService: CafeService
  ) {}

  ngOnInit() {
   this.subscription = this._cafeService.getCafes().subscribe(cafes => {
      console.log(cafes);
      this.cafes = cafes;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}