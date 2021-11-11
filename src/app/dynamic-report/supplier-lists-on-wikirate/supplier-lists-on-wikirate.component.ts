import {Component, OnInit} from '@angular/core';
import embed from "vega-embed";

@Component({
  selector: 'app-supplier-lists-on-wikirate',
  templateUrl: './supplier-lists-on-wikirate.component.html',
  styleUrls: ['./supplier-lists-on-wikirate.component.scss']
})
export class SupplierListsOnWikirateComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    embed("div#line-chart", {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "Apparel Top 100 Companies Reporting their Suppliers.",
      "width": 400,
      "height": 200,
      "padding": 5,
      "signals": [{"name": "interpolate", "value": "cardinal"}],
      "title": {
        "text": "Apparel Top 100 Companies Reporting their Suppliers.",
        "subtitle": ["Number of Apparel Top 100 Companies making their list of suppliers publicly", "available over the years."],
        "subtitleFontStyle": "italic",
        "subtitlePadding": 5,
        "frame": "bounds",
        "anchor": "start",
        "offset": 12,
        "zindex": 0
      },
      "data": [
        {
          "name": "supplier_lists",
          "url": "https://wikirate.org/Commons+Supplier_List_all+Answer.json?filter[not_ids]=&filter[company_name]=&filter[value][]=Yes&filter[company_group][]=Apparel%20100%20Companies&limit=0&view=answer_list",
          "format": {"type": "json", "property": "items"},
          "transform": [
            {
              "type": "aggregate",
              "groupby": ["year"],
              "fields": ["company"],
              "ops": ["count"],
              "as": ["number_of_lists"]
            },
            {"type": "filter", "expr": "datum.year > 2016 && datum.year < 2021"}
          ]
        }
      ],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          "nice": true,
          "zero": false,
          "round": true,
          "domain": [2016, 2021]
        },
        {
          "name": "y",
          "type": "linear",
          "domain": [0, 100],
          "range": "height",
          "nice": true,
          "zero": false,
          "round": true
        },
        {
          "name": "align",
          "type": "ordinal",
          "domain": ["left", "right", "top", "bottom"],
          "range": ["right", "left", "center", "center"]
        },
        {
          "name": "base",
          "type": "ordinal",
          "domain": ["left", "right", "top", "bottom"],
          "range": ["middle", "middle", "bottom", "top"]
        },
        {
          "name": "dx",
          "type": "ordinal",
          "domain": ["left", "right", "top", "bottom"],
          "range": [-7, 6, 0, 0]
        },
        {
          "name": "dy",
          "type": "ordinal",
          "domain": ["left", "right", "top", "bottom"],
          "range": [1, 1, -5, 8]
        }
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "tickMinStep": 1, "format": ""},
        {"orient": "left", "scale": "y", "tickMinStep": 2}
      ],
      "marks": [
        {
          "type": "line",
          "from": {"data": "supplier_lists"},
          "encode": {
            "enter": {
              "interpolate": {"value": "linear"},
              "x": {"scale": "x", "field": "year"},
              "y": {"scale": "y", "field": "number_of_lists"},
              "stroke": {"value": "#000"},
              "strokeWidth": {"value": 3}
            }
          }
        },
        {
          "type": "symbol",
          "from": {"data": "supplier_lists"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "year"},
              "y": {"scale": "y", "field": "number_of_lists"},
              "fill": {"value": "#fff"},
              "stroke": {"value": "#000"},
              "strokeWidth": {"value": 1},
              "size": {"value": 60},
              "tooltip": {
                "signal": "{'Number of Companies': datum.number_of_lists, 'Year': datum.year}"
              }
            },
            "update": {"fill": {"value": "#fff"}, "stroke": {"value": "#000"}},
            "hover": {"fill": {"value": "#000"}, "stroke": {"value": "#fff"}}
          }
        }
      ]
    }, {renderer:"svg"});
  }

}
