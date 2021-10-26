import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageYoffset = 0;

  @HostListener('window:scroll', ['$event']) onScroll(event: any) {
    this.pageYoffset = window.pageYOffset;
  }

  constructor(private scroll: ViewportScroller) {
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }
}

