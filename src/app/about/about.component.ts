import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import 'bootstrap';
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  @ViewChild('carousel', {static: true}) carousel!: ElementRef;
  currentIndex = 1

  constructor(private scroll: ViewportScroller) {
  }

  ngOnInit(): void {
    this.scrollToTop();
  }

  prev() {
    this.carousel.nativeElement.carousel('prev')
  }

  next() {
    this.carousel.nativeElement.on('slid.bs.carousel', () => {
      this.carousel.nativeElement.carousel('2')
    })
  }

  scrollToTop(){
    this.scroll.scrollToPosition([0,0]);
  }
}
