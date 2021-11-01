import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {
// @ts-ignore
  report_params: { year: number, id: number };

  constructor(private route: ActivatedRoute, private scroll: ViewportScroller) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.report_params = {
        id: +params['id'],
        year: params['year']
      };
      console.log(this.report_params.id)
    });
    this.scrollToTop();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }


}
