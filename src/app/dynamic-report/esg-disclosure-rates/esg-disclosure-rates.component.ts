import {Component, OnInit} from '@angular/core';
import embed from "vega-embed";

@Component({
  selector: 'app-esg-disclosure-rates',
  templateUrl: './esg-disclosure-rates.component.html',
  styleUrls: ['./esg-disclosure-rates.component.scss']
})
export class EsgDisclosureRatesComponent implements OnInit {
  selectedYear: string | number = 'latest';

  constructor() {
  }

  ngOnInit(): void {
    this.updateBarChart()
  }

  updateBarChart() {
    embed("div#esg-overall-wikirating",
      {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "ESG Disclosure Rate",
        "width": 1080,
        "height": 400,
        "padding": 5,
        "signals": [{
          "name": "companies", "value": 30,
          "bind": {"input": "range", "min": 20, "max": 100, "step": 1}
        },
          {
            "name": "order", "value": "descending",
            "bind": {"input": "select", "options": ["ascending", "descending"]}
          }],
        "data": [
          {
            "name": "apparel_companies",
            "url": "../../assets/content/Apparel-100-Companies.json",
            "format": {"type": "json", "property": "items"}
          },
          {
            "name": "suppplier_info",
            "url": "https://wikirate.org/Apparel_Research_Group+ESG_Disclosure_Rate+Answers.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&filter[company_group][]=Apparel%20100%20Companies&view=answer_list&limit=0",
            "format": {"type": "json", "parse": {"value": "number"}},
            "transform": [
              {
                "type": "lookup",
                "from": "apparel_companies",
                "key": "id",
                "fields": ["company"],
                "values": ["name", "headquarters"],
                "as": ["company_name", "headquarters"],
                "default": 0
              },
              {
                "type": "window",
                "sort": {"field": "value", "order": {"signal": "order"}},
                "ops": ["row_number"], "as": ["rank"]
              },
              {
                "type": "filter",
                "expr": "datum.rank <= companies"
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
                "y": {"scale": "y", "value": 0},
                "y2": {"scale": "y", "field": "value"},
                "x": {"scale": "x", "field": "company_name"},
                "width": {"scale": "x", "band": 1},
                "tooltip": {
                  "signal": "{'Company':datum.company_name, 'Headquarters':datum.headquarters , 'ESG Disclosure Rate':datum.rate}"
                },
                "fill": {"scale": "color", "field": "value"},
                "cornerRadiusTopRight": {"value": 3},
                "cornerRadiusTopLeft": {"value": 3}
              },
              "hover": {"fill": {"value": "black"}}
            }
          }
        ],
        "scales": [
          {
            "name": "y",
            "type": "linear",
            "domain": {"data": "suppplier_info", "field": "value"},
            "range": "height",
            "nice": true
          },
          {
            "name": "x",
            "type": "band",
            "domain": {
              "data": "suppplier_info",
              "field": "company_name",
              "sort": {"op": "max", "field": "value", "order": {"signal": "order"}}
            },
            "range": "width",
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
            "scale": "y",
            "orient": "left",
            "format": ",d",
            "tickCount": 5,
            "labelFontSize": {"signal": "10 + 300 / companies"}
          },
          {
            "scale": "x",
            "orient": "bottom",
            "labelAngle": 55,
            "labelAlign": "left",
            "labelLimit": 100,
            "labelFontSize": {"signal": "10 + 300 / companies"}
          }
        ]
      }, {
        renderer: "svg", actions: {
          source: false,
          editor: false
        }
      });
  }

}
