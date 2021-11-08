import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  pageYoffset = 0;

  @HostListener('window:scroll', ['$event']) onScroll(event: any) {
    this.pageYoffset = window.pageYOffset;
  }

  constructor(private scroll: ViewportScroller, private router: Router) {
  }

  ngOnInit(): void {
    this.setUpAnalytics();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  setUpAnalytics() {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      // @ts-ignore
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-KP6VMMHLSE',
          {
            'page_path': event.urlAfterRedirects
          }
        );
        gtag('config', 'UA-34941429-8',
          {
            'page_path': event.urlAfterRedirects
          }
        );
      });


  }
}

