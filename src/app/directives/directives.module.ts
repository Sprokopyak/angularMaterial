import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatchHeightDirective } from "./same-height.directive";
import { ScrollableDirective } from './scrollable.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MatchHeightDirective, ScrollableDirective],
  exports: [MatchHeightDirective, ScrollableDirective]
})
export class DirectivesModule {}
