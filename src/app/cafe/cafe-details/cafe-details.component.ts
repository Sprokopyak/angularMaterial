import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnInit, Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { CafeService } from "../../core/cafe-service/cafe.service";
import { Cafe } from "../../core/models/cafe.model";

@Component({
  selector: "app-cafe-details",
  templateUrl: "./cafe-details.component.html",
  styleUrls: ["./cafe-details.component.scss"]
})
export class CafeDetails implements OnInit {
  cafe;
  tables;
  cafeId;
  subscribtion;
  constructor(private _cafeService: CafeService, private route: ActivatedRoute) {
    route.params.subscribe(param => {      
      this.cafeId = param.id;
    });
  }
  ngOnInit(): void {    
    this.subscribtion =this._cafeService.getCafe(this.cafeId).subscribe(cafe => {
      console.log(cafe);
      this.cafe = cafe;
    })
  }

  book(obj, tablesNumber, booked){    
    let index = this.cafe.tables.indexOf(obj); 
    console.log( index);   
      if(booked < tablesNumber){
        this.cafe.tables[index].booked += 1;        
        this._cafeService.updateCafe(this.cafe)
      } else{
        console.log('no free tables');
      }
  }
  ngOnDestroy(){
    this.subscribtion.unsubscribe()
  }
}