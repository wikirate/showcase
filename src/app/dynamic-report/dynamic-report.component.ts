import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {
// @ts-ignore
  report_params: { year: number, id: number };

  constructor(private route: ActivatedRoute, private scroll: ViewportScroller, private meta: Meta, private titleService: Title) {
    titleService.setTitle("Apparel companies' ESG data disclosure ratings & supplier transparency");
    meta.addTags([
      {
        name: 'keywords',
        content: 'wikirate, esg data,apparel supply chain,apparel company esg ratings,manufacturing supply chain,supply chain,supply transparency,apparel esg data,fashion esg data,esg company,esg companies,esg company rating,esg rating,esg ratings,esg ranking,esg rankings,esg data ranking,esg data rating,environmental,environmental concerns,social concerns,environmental social corporate governance,adidas esg data,data visualizations,data infographics, Laureen van Breen'
      },
      {
        name: 'description',
        content: 'Discover ESG data disclosure ratings and supplier transparency of the biggest 100 apparel companies in infographics, charts, and maps by Wikirate.'
      },
      {
        name:'author',
        content:'Theresa Heithaus, Tom Howie, Laureen van Breen'
      }
    ])
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.report_params = {
        id: +params['id'],
        year: params['year']
      };
    });
    this.scrollToTop();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }


}
