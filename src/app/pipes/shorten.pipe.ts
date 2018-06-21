import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shorten"
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, number: number) {
    if (value.length > number) {
      return value.substr(0, number) + "...";
    }
    return value;
  }
}
