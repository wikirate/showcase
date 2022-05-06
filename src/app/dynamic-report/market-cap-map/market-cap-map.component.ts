import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import embed from "vega-embed";

@Component({
  selector: 'app-market-cap-map',
  templateUrl: './market-cap-map.component.html',
  styleUrls: ['./market-cap-map.component.scss']
})
export class MarketCapMapComponent implements OnInit, AfterViewInit {
  total_market_cap: string | number = 'unknown';
  total_employees: string | number = 'Unknown';
  number_of_suppliers: string | number = 'Unknown';
  workers_in_supply_chain: string | number = 'Unknown';
  selectedYear: string | number = 'latest'

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.updateSection()
  }

  ngAfterViewInit(): void {
  }

  updateSection() {
    let market_cap_answers = "https://wikirate.org/Core+Market_Cap+Answer.json?filter[not_ids]=&filter[year]=" + this.selectedYear + "&filter[company_group][]=Apparel%20100%20Companies&limit=0&view=answer_list";
    this.http.get<any>(market_cap_answers)
      .subscribe(data => {
        this.total_market_cap = this.getSum(data);
        embed("div#vis", {
          "$schema": "https://vega.github.io/schema/vega/v5.json",
          "description": "Market Cap of Apparel Top 100 Companies",
          "width": 900,
          "height": 560,
          'autosize': 'none',
          "signals": [
            {"name": "type", "value": "equalEarth"},
            {"name": "rotate0", "value": -15},
            {"name": "rotate1", "value": 0},
            {"name": "rotate2", "value": 0},
            {"name": "center0", "value": 0},
            {"name": "center1", "value": 0},
            {"name": "translate0", "update": "width / 2"},
            {"name": "translate1", "update": "height / 2"},
            {"name": "borderWidth", "value": 1},
            {
              "name": "hover",
              "value": null,
              "on": [
                {"events": "@circles:mouseover", "update": "datum"},
                {"events": "@circles:mouseout", "update": "null"}
              ]
            },
            {
              "name": "title",
              "value": "Market Cap of Apparel Top 100 Companies",
              "update": "hover ? hover.name + ' (' + hover.market_cap_text + ')' : 'Market Cap of Apparel Top 100 Companies'"
            },
            {
              "name": "cell_stroke",
              "value": null,
              "on": [
                {"events": "dblclick", "update": "cell_stroke ? null : 'brown'"},
                {"events": "mousedown!", "update": "cell_stroke"}
              ]
            },
            {"name": "tx", "update": "width / 2"},
            {"name": "ty", "update": "height / 2"}
          ],
          "data": [
            {
              "name": "world",
              "url": "assets/world-110m.json",
              "format": {"type": "topojson", "feature": "countries"},
              "transform": [{"type": "geopath", "projection": "projection"}]
            },
            {
              "name": "market_cap",
              "values": data,
              "format": {"type": "json", "parse": {"value": "number"}}
            },
            {
              "name": "apparel_top_100_geo",
              "values": [
                {"company": "Puma", "lat": 49.5755269, "lng": 10.8714149},
                {"company": "H&M", "lat": 59.3317973, "lng": 18.0583112},
                {"company": "Gap inc.", "lat": 37.79081085, "lng": -122.3909804},
                {
                  "company": "Marks and Spencer Group plc",
                  "lat": 51.51865225,
                  "lng": -0.175000995
                },
                {"company": "Asos", "lat": 51.5333888, "lng": -0.139905636},
                {"company": "Nike Inc.", "lat": 45.507191, "lng": -122.827393},
                {"company": "Adidas AG", "lat": 49.58253265, "lng": 10.91048856},
                {
                  "company": "Louis Vuitton Malletier SA (LVMH)",
                  "lat": 48.8586162,
                  "lng": 2.3429393
                },
                {
                  "company": "Burberry Group plc",
                  "lat": 51.49437555,
                  "lng": -0.126392473
                },
                {"company": "Guess? Inc", "lat": 34.02410214, "lng": -118.2391726},
                {"company": "Zalando SE", "lat": 52.50655705, "lng": 13.44148723},
                {"company": "Nordstrom", "lat": 47.614361, "lng": -122.335852},
                {"company": "Fossil Group, Inc.", "lat": 32.939486, "lng": -96.745425},
                {"company": "Inditex", "lat": 43.32307, "lng": -8.49019},
                {
                  "company": "American Eagle Outfitters",
                  "lat": 40.4282854,
                  "lng": -79.9606724
                },
                {"company": "Hugo Boss AG", "lat": 48.54694115, "lng": 9.271591308},
                {"company": "Urban Outfitters", "lat": 39.9046154, "lng": -75.1739344},
                {
                  "company": "Skechers USA Inc",
                  "lat": 33.88490024,
                  "lng": -118.4100629
                },
                {
                  "company": "Ralph Lauren Corporation",
                  "lat": 40.7638797,
                  "lng": -73.97161599
                },
                {"company": "Prada", "lat": 43.5463209, "lng": 11.5707173},
                {"company": "Under Armour", "lat": 39.27516635, "lng": -76.5903856},
                {"company": "Tapestry Inc", "lat": 40.75274965, "lng": -74.00152052},
                {
                  "company": "Columbia Sportswear",
                  "lat": 45.52966955,
                  "lng": -122.8248874
                },
                {"company": "Foot Locker Inc.", "lat": 40.7526738, "lng": -73.9950505},
                {
                  "company": "Abercrombie & Fitch",
                  "lat": 40.0904919,
                  "lng": -82.7755106
                },
                {"company": "Macy's", "lat": 40.7509149, "lng": -73.98933149},
                {"company": "DSW Inc.", "lat": 39.98864, "lng": -82.89824},
                {
                  "company": "Esprit Holdings Limited",
                  "lat": 22.2924077,
                  "lng": 114.20294
                },
                {"company": "Moncler", "lat": 45.4540887, "lng": 9.1588378},
                {"company": "Asics Corporation", "lat": 34.6913, "lng": 135.183},
                {"company": "Ross Stores", "lat": 37.7079277, "lng": -121.8881302},
                {"company": "Chico's FAS Inc", "lat": 28.75054, "lng": -82.5001},
                {
                  "company": "Gildan Activewear Inc.",
                  "lat": 45.504205,
                  "lng": -73.571125
                },
                {"company": "Boohoo.com", "lat": 53.480813, "lng": -2.2326412},
                {
                  "company": "Anta Sports Products",
                  "lat": 24.66745455,
                  "lng": 118.5540534
                },
                {"company": "Gerry Weber", "lat": 52.0603355, "lng": 8.3615619},
                {"company": "Brunello Cucinelli", "lat": 43.0830538, "lng": 12.277156},
                {"company": "Next", "lat": 52.6071351, "lng": -1.2418189},
                {
                  "company": "Salvatore Ferragamo SpA",
                  "lat": 43.7722809,
                  "lng": 11.2513491
                },
                {"company": "Express Inc", "lat": 40.001342, "lng": -83.094886},
                {"company": "Tiffany & Co.", "lat": 42.7158328, "lng": -73.7079487},
                {
                  "company": "Hermes International",
                  "lat": 48.8688993,
                  "lng": 2.3217376
                },
                {
                  "company": "Hudson's Bay Company",
                  "lat": 43.7823924,
                  "lng": -79.7718789
                },
                {"company": "United Arrows", "lat": 35.706766, "lng": 139.7616265},
                {"company": "Canada Goose", "lat": 43.6954839, "lng": -79.46397981},
                {
                  "company": "Bosideng International Holdings Limited",
                  "lat": 31.2322758,
                  "lng": 121.4692071
                },
                {"company": "Metersbonwe", "lat": 31.2322758, "lng": 121.4692071},
                {
                  "company": "Dick's Sporting Goods",
                  "lat": 40.465624,
                  "lng": -80.205892
                },
                {
                  "company": "Capri Holdings Ltd (formerly Michael Kors)",
                  "lat": 51.514140,
                  "lng": -0.118280
                },
                {"company": "Buckle Inc", "lat": 40.699424, "lng": -99.105033},
                {"company": "TOD'S", "lat": 43.2627, "lng": 13.7203},
                {"company": "Dillard's, Inc.", "lat": 34.753373, "lng": -92.287569},
                {"company": "Li-Ning", "lat": 39.812904, "lng": 116.547259},
                {"company": "Children's Place Inc", "lat": 40.78885, "lng": -74.056035},
                {"company": "Steve Madden", "lat": 40.75017166, "lng": -73.91508484},
                {
                  "company": "lululemon athletica",
                  "lat": 49.272004,
                  "lng": -123.147121
                },
                {"company": "PVH", "lat": 40.74969101, "lng": -73.98155975},
                {"company": "Ted Baker", "lat": 51.537667, "lng": -0.132265},
                {"company": "Fast Retailing", "lat": 34.0372, "lng": 131.3577},
                {
                  "company": "JD Sports Fashion plc",
                  "lat": 53.573908,
                  "lng": -2.278928
                },
                {
                  "company": "Burlington Stores Inc",
                  "lat": 40.094145,
                  "lng": -74.812232
                },
                {"company": "Sports Direct", "lat": 53.2063042, "lng": -1.2205319},
                {"company": "Superdry plc", "lat": 51.9202605, "lng": -2.0968209},
                {"company": "VF", "lat": 39.751618, "lng": -105.002998},
                {"company": "Christian Dior", "lat": 48.8697044, "lng": 2.325038},
                {"company": "Semir", "lat": 27.9963899, "lng": 120.695345},
                {"company": "L Brands", "lat": 39.981797, "lng": -83.033627},
                {
                  "company": "Deckers Outdoor Corporation",
                  "lat": 34.4314978,
                  "lng": -119.8635551
                },
                {"company": "Hanesbrands", "lat": 36.18900595, "lng": -80.2640623},
                {"company": "Carter's Inc", "lat": 33.848681, "lng": -84.366387},
                {"company": "TJX", "lat": 42.308755, "lng": -71.382745},
                {
                  "company": "Oxford Industries Inc",
                  "lat": 33.7811172,
                  "lng": -84.3837092
                },
                {"company": "Cato Corp", "lat": 35.128699, "lng": -80.87873},
                {"company": "JC Penney", "lat": 33.0136764, "lng": -96.6925096},
                {
                  "company": "G-III Apparel Group, LTD.",
                  "lat": 40.6256945,
                  "lng": -73.9870861
                },
                {
                  "company": "Lojas Renner S.A.",
                  "lat": -30.0324999,
                  "lng": -51.2303767
                },
                {"company": "Kering", "lat": 48.8464177, "lng": 2.3153025},
                {"company": "Caleres Inc", "lat": 38.6526865, "lng": -90.3477704},
                {"company": "Genesco Inc.", "lat": 36.114742, "lng": -86.693776},
                {
                  "company": "Ascena Retail Group Inc",
                  "lat": 41.07202702,
                  "lng": -74.17060403
                },
                {
                  "company": "Wolverine World Wide",
                  "lat": 43.13425389,
                  "lng": -85.54185089
                },
                {
                  "company": "Mulberry Group Plc",
                  "lat": 51.50370825,
                  "lng": -0.191581413
                },
                {"company": "Luxottica Group SpA", "lat": 45.4673878, "lng": 9.1775777},
                {"company": "Arvind Limited", "lat": 23.0583877, "lng": 72.6371753},
                {
                  "company": "Aditya Birla Fashion & Retail Ltd",
                  "lat": 19.0652797,
                  "lng": 72.8793805
                },
                {"company": "Vipshop Holdings", "lat": 23.1025812, "lng": 113.2245207},
                {"company": "Geox SpA", "lat": 45.7883555, "lng": 12.0476363},
                {
                  "company": "Alpargatas - Havaianas",
                  "lat": -23.5506507,
                  "lng": -46.6333824
                },
                {"company": "Onward Holdings", "lat": 35.666255, "lng": 139.775565},
                {
                  "company": "Lao Feng Xiang Jewelry",
                  "lat": 31.2322758,
                  "lng": 121.4692071
                },
                {"company": "Richemont", "lat": 46.2587, "lng": 6.1351},
                {"company": "Cia Hering", "lat": -7.33561, "lng": -47.46218},
                {"company": "Vera Bradley Inc.", "lat": 40.9570408, "lng": -85.3015323},
                {
                  "company": "Boot Barn Holdings Inc.",
                  "lat": 33.6596704,
                  "lng": -117.7380569
                },
                {"company": "Swatch Group", "lat": 47.1354263, "lng": 7.234641},
                {"company": "Francesca's", "lat": 29.83278726, "lng": -95.51077112},
                {"company": "Chow Tai Fook", "lat": 22.28365, "lng": 114.15494},
                {"company": "Van de Velde", "lat": 51.01324, "lng": 3.9258203},
                {
                  "company": "YOOX NET-A-PORTER Group SpA",
                  "lat": 45.4450409,
                  "lng": 9.1514221
                },
                {"company": "Grendene", "lat": -3.68611, "lng": -40.34972}
              ]
            },
            {
              "name": "apparel_top_100_companies",
              "url": "../../assets/content/Apparel-100-Companies.json",
              "format": {"type": "json", "property": "items"},
              "transform": [
                {
                  "type": "lookup",
                  "from": "market_cap",
                  "key": "company",
                  "fields": ["id"],
                  "values": ["value"],
                  "as": ["market_cap"],
                  "default": 0
                },
                {
                  "type": "lookup",
                  "from": "apparel_top_100_geo",
                  "key": "company",
                  "fields": ["name"],
                  "values": ["lat", "lng"],
                  "as": ["lat", "lng"],
                  "default": 0
                },
                {
                  "type": "geopoint",
                  "projection": "projection",
                  "fields": ["lng", "lat"]
                },
                {
                  "type": "formula",
                  "as": "market_cap_text",
                  "expr": "replace(format(datum.market_cap,'$,.4s'), 'G', 'B')"
                }
              ]
            },
            {
              "name": "graticule",
              "transform": [{"type": "graticule", "step": [15, 15]}]
            }
          ],
          "projections": [{"name": "projection", "type": "mercator"}],
          "scales": [
            {
              "name": "size",
              "domain": {"data": "apparel_top_100_companies", "field": "market_cap"},
              "zero": false,
              "range": [30, 500]
            },
            {
              "name": "color",
              "type": "linear",
              "nice": true,
              "domain": {"data": "apparel_top_100_companies", "field": "market_cap"},
              "range": ["#fef1eb", "#F7733D"]
            }
          ],
          "marks": [
            {
              "type": "shape",
              "from": {"data": "graticule"},
              "encode": {
                "update": {"strokeWidth": {"value": 1}, "fill": {"value": null}}
              },
              "transform": [{"type": "geoshape", "projection": "projection"}]
            },
            {
              "type": "shape",
              "from": {"data": "world"},
              "encode": {
                "update": {
                  "fill": {"value": "#1D1E3F"},
                  "stroke": {"value": "rgba(247,247,248, 0.8)"},
                  "strokeWidth": {"signal": "+borderWidth"},
                  "zindex": {"value": 0}
                }
              },
              "transform": [{"type": "geoshape", "projection": "projection"}]
            },
            {
              "name": "circles",
              "type": "symbol",
              "from": {"data": "apparel_top_100_companies"},
              "encode": {
                "enter": {
                  "x": {"field": "x"},
                  "y": {"field": "y"},
                  "size": {"scale": "size", "field": "market_cap"},
                  "fillOpacity": {"value": 1},
                  "stroke": {"value": "white"},
                  "strokeWidth": {"value": 0.5},
                  "tooltip": {
                    "signal": "{'title': datum.name,'Headquarters': datum.headquarters, 'Market Cap': datum.market_cap_text}"
                  }
                },
                "update": {
                  "fill": {"scale": "color", "field": "market_cap"},
                  "stroke": {"value": "#171832"}
                },
                "hover": {"fill": {"value": "#912E06"}, "stroke": {"value": "#171832"}}
              },
              "transform": [
                {
                  "type": "force",
                  "static": true,
                  "forces": [
                    {
                      "force": "collide",
                      "radius": {"expr": "1 + sqrt(datum.size) / 2"}
                    },
                    {"force": "x", "x": "datum.x"},
                    {"force": "y", "y": "datum.y"}
                  ]
                }
              ]
            },
            {
              "type": "text",
              "interactive": false,
              "encode": {
                "enter": {
                  "x": {"value": 895},
                  "y": {"value": 550},
                  "fill": {"value": "#F7F7F8"},
                  "fontSize": {"value": 12},
                  "align": {"value": "right"}
                },
                "update": {"text": {"signal": "title"}}
              }
            }
          ],
          "legends": [
            {
              "fill": "color",
              "orient": "bottom-left",
              "title": "Market Cap (in USD$)",
              "labelColor": "#F7F7F8",
              "titleColor": "#F7F7F8"
            }
          ]
        }, {
          renderer: "svg", actions: {
            source: false,
            editor: false
          }
        })
          .catch(console.warn);
      });

    let employees_metric_answers = "https://wikirate.org/Commons+Employee+Answer.json?filter[not_ids]=&filter[company_name]=&filter[year]=" + this.selectedYear + "&filter[company_group][]=Apparel%20100%20Companies&limit=0&view=answer_list"
    this.http.get<any>(employees_metric_answers)
      .subscribe(response => {
        this.total_employees = this.getSum(response)
      });

    let suppliers_answers = "https://wikirate.org/Commons+Supplied_By+Answers.json?filter[not_ids]=&filter[company_name]=&filter[company_group][]=Apparel%20100%20Companies&filter[year]=" + this.selectedYear + "&limit=100&view=answer_list";
    this.http.get<any>(suppliers_answers)
      .subscribe(response => {
        this.number_of_suppliers = this.getSum(response);
      });

    let workers_answers = "https://wikirate.org/Clean_Clothes_Campaign+Number_of_Workers+Answers.json?filter[not_ids]=&filter[company_name]=&filter[company_group][]=Supplier of Apparel 100&view=answer_list"
    this.http.get<any>(workers_answers)
      .subscribe(response => {
        this.workers_in_supply_chain = this.getSum(response);
      });

  }

  private getSum(response: []) {
    let sum = 0;
    for (var i = 0; i < response.length; i++) {
      if (response[i]['value'] !== "Unknown" && !Number.isNaN(Number(response[i]['value'])))
        sum += Number(response[i]['value']);
    }
    if (sum == 0) {
      this.workers_in_supply_chain = 'Unknown'
    }
    return sum;
  }

}
