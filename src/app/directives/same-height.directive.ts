import { Directive, ElementRef, AfterViewChecked, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[samehHeight]'
})
export class MatchHeightDirective implements AfterViewChecked {
  @Input() samehHeight: any;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked() {
    this.matchHeight(this.el.nativeElement, this.samehHeight);
  }

  @HostListener('window:resize')
  onResize() {
    this.matchHeight(this.el.nativeElement, this.samehHeight);
  }

  matchHeight(parent: HTMLElement, className: string) {
    if (!parent) return;
    const children = parent.getElementsByClassName(className);

    if (!children) return;

    Array.from(children).forEach((x: HTMLElement) => {
      x.style.height = 'initial';
    });

    const itemHeights = Array.from(children).map(
      x => x.getBoundingClientRect().height
    );

    const maxHeight = itemHeights.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);

    Array.from(children).forEach(
      (x: HTMLElement) => (x.style.height = `${maxHeight}px`)
    );
  }
}
