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
export class NumberOfSuppliersPerCompanyComponent implements OnInit, AfterViewInit, OnDestroy {

  paramsSubscription!: Subscription;
  report_params!: { year: number };
  number_of_reporting_companies: number | string = 'Unknown'
  unique_suppliers: number | string = 'Unknown'

  constructor(private http: HttpClient,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.report_params = {
      year: this.route.snapshot.params['year']
    }
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
        this.report_params.year = params['year'];

        let url = "https://wikirate.org/Commons+Supplied_By+Answer.json?filter[not_ids]=&filter[company_name]=&filter[company_group][]=Apparel%20100%20Companies&view=answer_list&limit=0&filter[year]=" + this.report_params.year;
        this.http.get<any>(url)
          .subscribe(response => {
            this.number_of_reporting_companies = 0;
            for (var i = 0; i < response.length; i++) {
              if (response[i]['value'] !== "Unknown") {
                this.number_of_reporting_companies++;
              }
            }
            this.updateChart(response, this.report_params.year)
          });

        let num_of_suppliers_url = "https://wikirate.org/Commons+Supplier_of+Answer.json?filter[not_ids]=&filter[company_name]=&filter[company_group][]=Supplier%20of%20Apparel%20100&filter[year]=" + this.report_params.year + "&view=answer_list&limit=0"
        this.http.get<any>(num_of_suppliers_url)
          .subscribe(response => {
            this.unique_suppliers = response.length;
          });
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  updateChart(data: [], year: number) {
    embed("div#bar-chart", {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "Number of Reported Suppliers",
      "width": 550,
      "height": 410,
      "padding": 5,
      "autosize": "fit",
      "title": {
        "text": {"signal": "'Number of Reported Suppliers (" + year + ")'"},
        "subtitle": "Number of Reported Suppliers per Apparel Company",
        "subtitleFontStyle": "italic",
        "subtitlePadding": 5,
        "anchor": "start",
        "frame": "group",
        "color": "#F7F7F8",
        "subtitleColor": "#F7F7F8"
      },
      "data": [
        {
          "name": "companies",
          "url": "https://wikirate.org/Company+browse_company_filter.json?filter[company_group][]=Apparel%20100%20Companies&limit=0",
          "format": {"type": "json", "property": "items"}
        },
        {
          "name": "suppplier_info",
          "values": data,
          "format": {"type": "json", "parse": {"value": "number"}},
          "transform": [
            {"type": "filter", "expr": "datum.year > 2016 && datum.year < 2021"},
            {"type": "filter", "expr": "datum.value > 0"},
            {
              "type": "lookup",
              "from": "companies",
              "key": "id",
              "fields": ["company"],
              "values": ["name", "headquarters"],
              "as": ["company_name", "headquarters"],
              "default": 0
            }
          ]
        }
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "suppplier_info"},
          "encode": {
            "update": {
              "x": {"scale": "x", "value": 0},
              "x2": {"scale": "x", "field": "value"},
              "y": {"scale": "y", "field": "company_name"},
              "height": {"scale": "y", "band": 1},
              "tooltip": {
                "signal": "{'title':datum.company_name, 'Headquarters':datum.headquarters , 'Number of Suppliers':datum.value}"
              },
              "fill": {"scale": "color", "field": "value"},
              "cornerRadiusTopRight": {"value": 5},
              "cornerRadiusBottomRight": {"value": 5}
            },
            "hover": {"fill": {"value": "#d9daed"}}
          }
        }
      ],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "domain": {"data": "suppplier_info", "field": "value"},
          "range": "width",
          "nice": true
        },
        {
          "name": "y",
          "type": "band",
          "domain": {
            "data": "suppplier_info",
            "field": "company_name",
            "sort": {"op": "max", "field": "value", "order": "descending"}
          },
          "range": "height",
          "padding": 0.1
        },
        {
          "name": "color",
          "type": "linear",
          "nice": true,
          "domain": {"data": "suppplier_info", "field": "value"},
          "range": ["#fef1eb", "#F7733D"]
        }
      ],
      "axes": [
        {
          "scale": "x",
          "orient": "bottom",
          "format": ",d",
          "tickCount": 5,
          "tickColor": "#F7F7F8",
          "labelColor": "#F7F7F8"
        },
        {"scale": "y", "orient": "left", "tickColor": "#F7F7F8", "labelColor": "#F7F7F8"}
      ]
    })
  }

}
