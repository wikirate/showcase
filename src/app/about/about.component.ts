import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import 'bootstrap';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  @ViewChild('carousel', {static: true}) carousel!: ElementRef;
  currentIndex = 1

  constructor() {
  }

  ngOnInit(): void {
  }

  prev() {
    this.carousel.nativeElement.carousel('prev')
  }

  next() {
    this.carousel.nativeElement.on('slid.bs.carousel', () => {
      this.carousel.nativeElement.carousel('2')
    })
  }
}
