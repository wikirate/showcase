import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {
// @ts-ignore
  report_params: { year: number, id: number };
  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.report_params = {
      id: this.route.snapshot.params['id'],
      year: this.route.snapshot.params['year']
    }
    console.log('year' + this.report_params.year)
  }



}
