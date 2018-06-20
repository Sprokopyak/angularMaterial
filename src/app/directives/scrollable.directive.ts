import { Directive, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[scrollable]'
})
export class ScrollableDirective {

  @Input() loaded: any;

  @Output() scrollPosition = new EventEmitter()
  private scrollEvent$;

  constructor(private el: ElementRef) {

    this.scrollEvent$ = fromEvent(this.el.nativeElement, 'scroll').subscribe((e: any) => {
      try {
        const top = e.target.scrollTop
        const height = this.el.nativeElement.scrollHeight
        const offset = this.el.nativeElement.offsetHeight

        if (top > height - offset - 1) {
          this.scrollPosition.emit('bottom')
        }

        if (top === 0) {
          this.scrollPosition.emit('top')
        }

      } catch (err) {
        console.error(err);
      }
    });
  }
}