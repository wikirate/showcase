import {Component, OnInit} from '@angular/core';
import embed from "vega-embed";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {ApparelService} from "../../services/apparel.service";

@Component({
  selector: 'app-esg-performance',
  templateUrl: './esg-performance.component.html',
  styleUrls: ['./esg-performance.component.scss']
})
export class EsgPerformanceComponent implements OnInit {
  paramsSubscription!: Subscription;
  report_params!: { year: number, id: number };
  environmental_disclosure_rate: number = 0;
  social_disclosure_rate: number = 0;
  governance_disclosure_rate: number = 0;

  constructor(private http: HttpClient,
              private route: ActivatedRoute, private apparelService: ApparelService) {
  }

  ngOnInit(): void {
    this.report_params = {
      year: this.route.snapshot.params['year'],
      id: this.route.snapshot.params['id']
    }
    this.createBarChart();
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.report_params.year = params['year'];
      this.report_params.id = params['id']
      if (this.report_params.id != 0) {
        this.http.get<any>("https://wikirate.org/Laureen_van_Breen+Environmental_Disclosure_Rating+~" + this.report_params.id + "+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&limit=0&view=answer_list")
          .subscribe(response => {
            this.environmental_disclosure_rate = response[0]['value']
            this.http.get<any>("https://wikirate.org/theresah+Social_Disclosure_Rating+~" + this.report_params.id + "+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&limit=0&view=answer_list")
              .subscribe(response => {
                this.social_disclosure_rate = response[0]['value']
                this.http.get<any>("https://wikirate.org/theresah+Governance_Disclosure_Rating+~" + this.report_params.id + "+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&limit=0&view=answer_list")
                  .subscribe(response => {
                    this.governance_disclosure_rate = response[0]['value']
                    // @ts-ignore
                    this.createRadarChart("of " + this.apparelService.getCompany(+this.report_params.id).name);
                  })
              })
          })
      } else {
        this.http.get<any>("https://wikirate.org/Laureen_van_Breen+Environmental_Disclosure_Rating+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&limit=0&view=answer_list")
          .subscribe(response => {
            this.environmental_disclosure_rate = 0;
            for (var i = 0; i < response.length; i++) {
              this.environmental_disclosure_rate += +response[i]['value'];
            }
            this.environmental_disclosure_rate = this.environmental_disclosure_rate / response.length;
            this.http.get<any>("https://wikirate.org/theresah+Social_Disclosure_Rating+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&limit=0&view=answer_list")
              .subscribe(response => {
                this.social_disclosure_rate = 0;
                for (var i = 0; i < response.length; i++) {
                  this.social_disclosure_rate += +response[i]['value'];
                }
                this.social_disclosure_rate = this.social_disclosure_rate / response.length;
                this.http.get<any>("https://wikirate.org/theresah+Governance_Disclosure_Rating+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&limit=0&view=answer_list")
                  .subscribe(response => {
                    this.governance_disclosure_rate = 0;
                    for (var i = 0; i < response.length; i++) {
                      this.governance_disclosure_rate += +response[i]['value'];
                    }
                    this.governance_disclosure_rate = this.governance_disclosure_rate / response.length;
                    this.createRadarChart("of Apparel Top 100 (avg Rating)");
                  })
              })
          })
      }
    })

  }

  createBarChart() {
    embed("div#esg-overall-wikirating",
      {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "ESG Disclosure Rate ",
        "width": 500,
        "height": 1400,
        "padding": 5,
        "autosize": "fit",
        "title": {
          "text": {"signal": "'ESG Disclosure Rate'"},
          "subtitle": [
            "What is the company's score on disclosure of environmental, social",
            "and governance indicators?"
          ],
          "subtitleFontStyle": "italic",
          "subtitlePadding": 5,
          "anchor": "start",
          "frame": "group"
        },
        "data": [
          {
            "name": "companies",
            "url": "https://wikirate.org/Company+browse_company_filter.json?filter[company_group][]=Apparel%20100%20Companies&limit=0",
            "format": {"type": "json", "property": "items"}
          },
          {
            "name": "suppplier_info",
            "url": "https://wikirate.org/Laureen_van_Breen+Environmental_Disclosure_Rating+Answers.json?filter[not_ids]=&filter[company_name]=&filter[year]=latest&filter[company_group][]=Apparel%20100%20Companies&view=answer_list&limit=0",
            "format": {"type": "json", "parse": {"value": "number"}},
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
              {"type": "formula", "as": "rate", "expr": "format(datum.value,',.2f')"}
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
                  "signal": "{'Company':datum.company_name, 'Headquarters':datum.headquarters , 'ESG Disclosure Rate':datum.rate}"
                },
                "fill": {"scale": "color", "field": "value"},
                "cornerRadiusTopRight": {"value": 5},
                "cornerRadiusBottomRight": {"value": 5}
              },
              "hover": {"fill": {"value": "black"}}
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
            "range": ["#dadbeb", "#484C9D"]
          }
        ],
        "axes": [
          {"scale": "x", "orient": "bottom", "format": ",d", "tickCount": 5},
          {"scale": "y", "orient": "left"}
        ]
      });
  }

  createRadarChart(subtitle: string) {
    embed("div#esg-performance",
      {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A radar chart example, showing multiple dimensions in a radial layout.",
        "width": 410,
        "height": 360,
        "padding": 40,
        "autosize": {"type": "none", "contains": "padding"},
        "title": {
          "text": "ESG Disclosure Rate",
          "anchor": "middle",
          "fontSize": 14,
          "dy": -8,
          "dx": {"signal": "-width/4"},
          "subtitle": subtitle
        },
        "signals": [{"name": "radius", "update": "width / 2.2"}],
        "data": [
          {
            "name": "table",
            "values": [
              {
                "key": ["Environmental", "Disclosure", "Rate"],
                "value": (Math.round(this.environmental_disclosure_rate * 100) / 100).toFixed(2),
                "category": 0
              },
              {
                "key": ["Social", "Disclosure", "Rate"],
                "value": (Math.round(this.social_disclosure_rate * 100) / 100).toFixed(2),
                "category": 0
              },
              {
                "key": ["Governance", "Disclosure", "Rate"],
                "value": (Math.round(this.governance_disclosure_rate * 100) / 100).toFixed(2),
                "category": 0
              }
            ]
          },
          {
            "name": "keys",
            "source": "table",
            "transform": [{"type": "aggregate", "groupby": ["key"]}]
          }
        ],
        "scales": [
          {
            "name": "angular",
            "type": "point",
            "range": [-3.14159, 3.14159],
            "padding": 0.5,
            "domain": {"data": "table", "field": "key"}
          },
          {
            "name": "radial",
            "type": "linear",
            "range": {"signal": "[0, radius]"},
            "zero": true,
            "nice": false,
            "domain": [0, 10],
            "domainMin": 0
          },
          {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": "table", "field": "category"},
            "range": ["#484C9D", "#484C9D"]
          }
        ],
        "encode": {"enter": {"x": {"signal": "radius"}, "y": {"signal": "radius"}}},
        "marks": [
          {
            "type": "group",
            "name": "categories",
            "zindex": 1,
            "from": {
              "facet": {"data": "table", "name": "facet", "groupby": ["category"]}
            },
            "marks": [
              {
                "type": "line",
                "name": "category-line",
                "from": {"data": "facet"},
                "encode": {
                  "enter": {
                    "interpolate": {"value": "linear-closed"},
                    "x": {
                      "signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))"
                    },
                    "y": {
                      "signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))"
                    },
                    "stroke": {"scale": "color", "field": "category"},
                    "strokeWidth": {"value": 1},
                    "fill": {"scale": "color", "field": "category"},
                    "fillOpacity": {"value": 0.2}
                  }
                }
              },
              {
                "type": "text",
                "name": "value-text",
                "from": {"data": "category-line"},
                "encode": {
                  "enter": {
                    "x": {
                      "signal": "datum.x + 14 * cos(scale('angular', datum.datum.key))"
                    },
                    "y": {
                      "signal": "datum.y + 14 * sin(scale('angular', datum.datum.key))"
                    },
                    "text": {"signal": "datum.datum.value"},
                    "align": {"value": "center"},
                    "baseline": {"value": "middle"},
                    "fontWeight": {"value": "bold"},
                    "fill": {"value": "black"}
                  }
                }
              }
            ]
          },
          {
            "type": "rule",
            "name": "radial-grid",
            "from": {"data": "keys"},
            "zindex": 0,
            "encode": {
              "enter": {
                "x": {"value": 0},
                "y": {"value": 0},
                "x2": {"signal": "radius * cos(scale('angular', datum.key))"},
                "y2": {"signal": "radius * sin(scale('angular', datum.key))"},
                "stroke": {"value": "lightgray"},
                "strokeWidth": {"value": 1}
              }
            }
          },
          {
            "type": "text",
            "name": "key-label",
            "from": {"data": "keys"},
            "zindex": 1,
            "encode": {
              "enter": {
                "x": {"signal": "(radius + 11) * cos(scale('angular', datum.key))"},
                "y": {"signal": "(radius - 5) * sin(scale('angular', datum.key))"},
                "text": {"field": "key"},
                "align": [
                  {
                    "test": "abs(scale('angular', datum.key)) > PI / 2",
                    "value": "right"
                  },
                  {"value": "left"}
                ],
                "baseline": [
                  {"test": "scale('angular', datum.key) > 0", "value": "top"},
                  {"test": "scale('angular', datum.key) == 0", "value": "middle"},
                  {"value": "bottom"}
                ],
                "fill": {"value": "#171832"},
                "fontWeight": {"value": "bold"}
              }
            }
          },
          {
            "type": "line",
            "name": "outer-line",
            "from": {"data": "radial-grid"},
            "encode": {
              "enter": {
                "interpolate": {"value": "linear-closed"},
                "x": {"field": "x2"},
                "y": {"field": "y2"},
                "stroke": {"value": "lightgray"},
                "strokeWidth": {"value": 1}
              }
            }
          }
        ]
      })

  }
}
