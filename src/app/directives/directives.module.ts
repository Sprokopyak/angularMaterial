import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatchHeightDirective } from "./same-height.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [MatchHeightDirective],
  exports: [MatchHeightDirective]
})
export class DirectivesModule {}
