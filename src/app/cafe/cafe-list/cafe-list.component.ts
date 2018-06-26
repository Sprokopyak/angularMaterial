import { Component, Input } from '@angular/core';
import { CAFE_TYPES } from '../constants';

@Component({
  selector: 'app-cafe-list',
  templateUrl: './cafe-list.component.html',
  styleUrls: ['./cafe-list.component.scss']
})
export class CafeList {
  @Input('cafe') cafe;
  cafeTypes = CAFE_TYPES;
  
  getCafetype(type) {
    let typeName;
    this.cafeTypes.forEach(val => {
      if (val.value === type) {
        typeName = val.viewValue;
      }
    });
    return typeName;
  }
  
}