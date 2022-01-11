import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import embed from "vega-embed";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-number-of-suppliers-per-company',
  templateUrl: './number-of-suppliers-per-company.component.html',
  styleUrls: ['./number-of-suppliers-per-company.component.scss']
})
export class NumberOfSuppliersPerCompanyComponent implements OnInit, AfterViewInit {
  number_of_reporting_companies: number | string = 'Unknown'
  unique_suppliers: number | string = 'Unknown'
  selectedYear: string | number = 'latest'

  constructor(private http: HttpClient,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.updateSection()
    this.updateChart()
  }

  ngAfterViewInit(): void {
  }

  updateChart() {
    embed("div#bar-chart", {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "Number of Published Supplier Lists",
      "width": 750,
      "height": 510,
      "padding": 5,
      "autosize": "fit",
      "data": [
        {
          "name": "companies",
          "url": "../../assets/content/Apparel-100-Companies.json",
          "format": {"type": "json", "property": "items"}
        },
        {
          "name": "published_supplier_lists",
          "url": "https://wikirate.org/Commons+Supplier_List_all+Answers.json?filter[not_ids]=&filter[company_name]=&filter[value][]=Yes&filter[company_group][]=Apparel%20100%20Companies&view=answer_list&limit=0",
          "transform": [
            {
              "type": "lookup",
              "from": "companies",
              "key": "id",
              "fields": ["company"],
              "values": ["name", "headquarters"],
              "as": ["company_name", "headquarters"],
              "default": 0
            },
            {"type": "aggregate", "groupby": ["company_name", "headquarters"]}
          ]
        }
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "published_supplier_lists"},
          "encode": {
            "update": {
              "y": {"scale": "y", "value": 0},
              "y2": {"scale": "y", "field": "count"},
              "x": {"scale": "x", "field": "company_name"},
              "width": {"scale": "x", "band": 1},
              "tooltip": {
                "signal": "{'Company':datum.company_name, 'Headquarters':datum.headquarters , 'No. of Supplier Lists':datum.count}"
              },
              "fill": {"scale": "color", "field": "count"},
              "cornerRadiusTopRight": {"value": 5},
              "cornerRadiusTopLeft": {"value": 5}
            },
            "hover": {"fill": {"value": "#912E06"}}
          }
        }
      ],
      "scales": [
        {
          "name": "y",
          "type": "linear",
          "domain": {"data": "published_supplier_lists", "field": "count"},
          "range": "height",
          "nice": true
        },
        {
          "name": "x",
          "type": "band",
          "domain": {
            "data": "published_supplier_lists",
            "field": "company_name",
            "sort": {"op": "max", "field": "count", "order": "descending"}
          },
          "range": "width",
          "padding": 0.1
        },
        {
          "name": "color",
          "type": "linear",
          "nice": true,
          "domain": {"data": "published_supplier_lists", "field": "count"},
          "range": ["#fef1eb", "#F7733D"]
        }
      ],
      "axes": [
        {
          "scale": "y",
          "orient": "left",
          "format": ",d",
          "tickCount": 5,
          "labelFontSize": 14,
          "tickColor": "#F7F7F8",
          "labelColor": "#F7F7F8",
          "domainColor": "#F7F7F8"
        },
        {
          "scale": "x",
          "orient": "bottom",
          "labelAngle": 55,
          "labelAlign": "left",
          "labelLimit": 100,
          "labelFontSize": 14,
          "tickColor": "#F7F7F8",
          "labelColor": "#F7F7F8",
          "domainColor": "#F7F7F8"
        }
      ]
    }, {renderer: "svg", actions: {source: false, editor: false}})
  }

  updateSection() {
    let url = "https://wikirate.org/Commons+Supplied_By+Answer.json?filter[not_ids]=&filter[company_name]=&filter[company_group][]=Apparel%20100%20Companies&view=answer_list&limit=0&filter[year]=" + this.selectedYear;
    this.http.get<any>(url)
      .subscribe(response => {
        this.number_of_reporting_companies = 0;
        for (var i = 0; i < response.length; i++) {
          if (response[i]['value'] !== "Unknown") {
            this.number_of_reporting_companies++;
          }
        }
      });

    let num_of_suppliers_url = "https://wikirate.org/Commons+Supplier_of+Answer.json?filter[not_ids]=&filter[company_name]=&filter[company_group][]=Supplier%20of%20Apparel%20100&filter[year]=" + this.selectedYear + "&view=answer_list&limit=0"
    this.http.get<any>(num_of_suppliers_url)
      .subscribe(response => {
        this.unique_suppliers = response.length;
      });
  }
}
