import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import embed from "vega-embed";
import {ApparelService} from "../../services/apparel.service";
import {Company} from "../../models/company.model";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-suppliers-map',
  templateUrl: './suppliers-map.component.html',
  styleUrls: ['./suppliers-map.component.scss']
})
export class SuppliersMapComponent implements OnInit, AfterViewInit, OnDestroy {
  paramsSubscription!: Subscription;
  // @ts-ignore
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  title = 'were the Apparel Top 100'
  report_params!: { year: number | string, id: number };
  suppliers: [] = [];
  suppliers_map: any;

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private apparelService: ApparelService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.report_params = {
      year: this.route.snapshot.params['year'],
      id: this.route.snapshot.params['id']
    }

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
        this.report_params.year = params['year'];
        this.report_params.id = params['id']
        let company = this.apparelService.getCompany(+this.report_params.id);
        // @ts-ignore
        if (company.id != 0) {
          // @ts-ignore
          this.title = 'was ' + company.name
        }
        // @ts-ignore
        this.updateChart(this.report_params.year, company)
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  updateChart(year: number, company: Company) {
    let url = "https://wikirate.org/Commons+Supplied_By+RelationshipAnswer/answer_list.json?filter[company_group]=Apparel%20100%20Companies&filter[year]=" + year;
    if (company.id != 0) {
      url = 'https://wikirate.org/Commons+Supplied_By+RelationshipAnswer/answer_list.json?filter[company_id]=' + company.id + '&filter[year]=' + year;
    }
    this.suppliers = [];
    if (this.suppliers_map != null) {
      this.renderer.removeChild(this.mapElement.nativeElement, this.suppliers_map)
    }

    this.http.get<any>(url)
      .subscribe(response => {
          this.suppliers = response;

          if (this.suppliers.length > 0) {
            this.suppliers_map = this.renderer.createElement('div');
            this.suppliers_map.id = "supplier-map";
            this.renderer.appendChild(this.mapElement.nativeElement, this.suppliers_map)
            embed("div#supplier-map", {
              "$schema": "https://vega.github.io/schema/vega/v5.json",
              "description": "Number of Apparel Top 100 Suppliers per Country",
              "width": 900,
              "height": 560,
              "padding": {"top": 25, "left": 0, "right": 0, "bottom": 0},
              "autosize": "none",
              "signals": [
                {"name": "type", "value": "equalEarth"},
                {"name": "scale", "value": 200},
                {"name": "rotate0", "value": -15},
                {"name": "rotate1", "value": 0},
                {"name": "rotate2", "value": 0},
                {"name": "center0", "value": 0},
                {"name": "center1", "value": 0},
                {"name": "translate0", "update": "width / 2"},
                {"name": "translate1", "update": "height / 2"},
                {"name": "borderWidth", "value": 2},
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
                  "value": "Number of Apparel Top 100 Suppliers per Country",
                  "update": "hover ? hover.country + ' (' + hover.companies + ')' : 'Number of Apparel Top 100 Suppliers per Country'"
                },
                {
                  "name": "cell_stroke",
                  "value": null,
                  "on": [
                    {"events": "dblclick", "update": "cell_stroke ? null : 'brown'"},
                    {"events": "mousedown!", "update": "cell_stroke"}
                  ]
                }
              ],
              "data": [
                {
                  "name": "world",
                  "url": "assets/world-110m.json",
                  "format": {"type": "topojson", "feature": "countries"},
                  "transform": [{"type": "geopath", "projection": "projection"}]
                },
                {
                  "name": "suppliers_country",
                  "url": "../../assets/content/Core+Country+Answer.json",
                  "format": {"type": "json", "parse": "auto"}
                },
                {
                  "name": "suppliers",
                  "values": this.suppliers,
                  "transform": [
                    {
                      "type": "lookup",
                      "from": "suppliers_country",
                      "key": "company",
                      "fields": ["object_company"],
                      "values": ["value"],
                      "as": ["country"]
                    }
                  ]
                },
                {
                  "name": "wikirate_countries",
                  "values": [
                    {"code": "AD", "name": "Andorra", "card_id": 2917786},
                    {"code": "AE", "name": "United Arab Emirates", "card_id": 169529},
                    {"code": "AF", "name": "Afghanistan", "card_id": 2917789},
                    {"code": "AG", "name": "Antigua and Barbuda", "card_id": 2917790},
                    {"code": "AI", "name": "Anguilla", "card_id": 2917791},
                    {"code": "AL", "name": "Albania", "card_id": 2917792},
                    {"code": "AM", "name": "Armenia", "card_id": 2917793},
                    {"code": "AO", "name": "Angola", "card_id": 2917794},
                    {"code": "AQ", "name": "Antarctica", "card_id": 2917795},
                    {"code": "AR", "name": "Argentina", "card_id": 14400},
                    {"code": "AS", "name": "American Samoa", "card_id": 2917796},
                    {"code": "AT", "name": "Austria", "card_id": 17233},
                    {"code": "AU", "name": "Australia", "card_id": 14405},
                    {"code": "AW", "name": "Aruba", "card_id": 2917797},
                    {"code": "AX", "name": "Åland Islands", "card_id": 2917798},
                    {"code": "AZ", "name": "Azerbaijan", "card_id": 2917799},
                    {"code": "BA", "name": "Bosnia and Herzegovina", "card_id": 2917800},
                    {"code": "BB", "name": "Barbados", "card_id": 2917801},
                    {"code": "BD", "name": "Bangladesh", "card_id": 14386},
                    {"code": "BE", "name": "Belgium", "card_id": 19867},
                    {"code": "BF", "name": "Burkina Faso", "card_id": 14408},
                    {"code": "BG", "name": "Bulgaria", "card_id": 13973},
                    {"code": "BH", "name": "Bahrain", "card_id": 2917802},
                    {"code": "BI", "name": "Burundi", "card_id": 2917803},
                    {"code": "BJ", "name": "Benin", "card_id": 2917804},
                    {"code": "BL", "name": "Saint Barthélemy", "card_id": 2917805},
                    {"code": "BM", "name": "Bermuda", "card_id": 2917806},
                    {"code": "BN", "name": "Brunei Darussalam", "card_id": 2917807},
                    {"code": "BO", "name": "Bolivia", "card_id": 2917808},
                    {
                      "code": "BQ",
                      "name": "Bonaire, Sint Eustatius and Saba",
                      "card_id": 2917809
                    },
                    {"code": "BR", "name": "Brazil", "card_id": 12379},
                    {"code": "BS", "name": "Bahamas", "card_id": 2917810},
                    {"code": "BT", "name": "Bhutan", "card_id": 2917811},
                    {"code": "BV", "name": "Bouvet Island", "card_id": 2917812},
                    {"code": "BW", "name": "Botswana", "card_id": 2917813},
                    {"code": "BY", "name": "Belarus", "card_id": 2917814},
                    {"code": "BZ", "name": "Belize", "card_id": 2917815},
                    {"code": "CA", "name": "Canada", "card_id": 14965},
                    {"code": "CC", "name": "Cocos (Keeling) Islands", "card_id": 2917828},
                    {
                      "code": "CD",
                      "name": "Democratic Republic of the Congo",
                      "card_id": 2917829
                    },
                    {"code": "CF", "name": "Central African Republic", "card_id": 2917830},
                    {"code": "CG", "name": "Congo", "card_id": 38190},
                    {"code": "CH", "name": "Switzerland", "card_id": 15220},
                    {"code": "CI", "name": "Côte d'Ivoire", "card_id": 2917831},
                    {"code": "CK", "name": "Cook Islands", "card_id": 2917832},
                    {"code": "CL", "name": "Chile", "card_id": 14404},
                    {"code": "CM", "name": "Cameroon", "card_id": 2917833},
                    {"code": "CN", "name": "China", "card_id": 12378},
                    {"code": "CO", "name": "Colombia", "card_id": 12320},
                    {"code": "CR", "name": "Costa Rica", "card_id": 2917834},
                    {"code": "CU", "name": "Cuba", "card_id": 19542},
                    {"code": "CV", "name": "Cape Verde", "card_id": 2917835},
                    {"code": "CW", "name": "Curaçao", "card_id": 2917836},
                    {"code": "CX", "name": "Christmas Island", "card_id": 2917837},
                    {"code": "CY", "name": "Cyprus", "card_id": 2917838},
                    {"code": "CZ", "name": "Czech Republic", "card_id": 45425},
                    {"code": "DE", "name": "Germany", "card_id": 15272},
                    {"code": "DJ", "name": "Djibouti", "card_id": 2917839},
                    {"code": "DK", "name": "Denmark", "card_id": 21425},
                    {"code": "DM", "name": "Dominica", "card_id": 2917840},
                    {"code": "DO", "name": "Dominican Republic", "card_id": 18543},
                    {"code": "DZ", "name": "Algeria", "card_id": 2917841},
                    {"code": "EC", "name": "Ecuador", "card_id": 2917842},
                    {"code": "EE", "name": "Estonia", "card_id": 2917843},
                    {"code": "EG", "name": "Egypt", "card_id": 2917844},
                    {"code": "EH", "name": "Western Sahara", "card_id": 2917845},
                    {"code": "ER", "name": "Eritrea", "card_id": 2917846},
                    {"code": "ES", "name": "Spain", "card_id": 12333},
                    {"code": "ET", "name": "Ethiopia", "card_id": 14424},
                    {"code": "FI", "name": "Finland", "card_id": 2917847},
                    {"code": "FJ", "name": "Fiji", "card_id": 2917848},
                    {
                      "code": "FK",
                      "name": "Falkland Islands (Malvinas)",
                      "card_id": 2917849
                    },
                    {
                      "code": "FM",
                      "name": "Micronesia, Federated States of",
                      "card_id": 2917850
                    },
                    {"code": "FO", "name": "Faroe Islands", "card_id": 2917851},
                    {"code": "FR", "name": "France", "card_id": 19365},
                    {"code": "GA", "name": "Gabon", "card_id": 2917852},
                    {"code": "GB", "name": "United Kingdom", "card_id": 14908},
                    {"code": "GD", "name": "Grenada", "card_id": 2917853},
                    {"code": "GE", "name": "Georgia", "card_id": 2917854},
                    {"code": "GF", "name": "French Guiana", "card_id": 2917855},
                    {"code": "GG", "name": "Guernsey", "card_id": 2917856},
                    {"code": "GH", "name": "Ghana", "card_id": 18541},
                    {"code": "GI", "name": "Gibraltar", "card_id": 2917857},
                    {"code": "GL", "name": "Greenland", "card_id": 2917858},
                    {"code": "GM", "name": "Gambia", "card_id": 2917859},
                    {"code": "GN", "name": "Guinea", "card_id": 2917860},
                    {"code": "GP", "name": "Guadeloupe", "card_id": 2917861},
                    {"code": "GQ", "name": "Equatorial Guinea", "card_id": 2917862},
                    {"code": "GR", "name": "Greece", "card_id": 34142},
                    {
                      "code": "GS",
                      "name": "South Georgia and the South Sandwich Islands",
                      "card_id": 2917863
                    },
                    {"code": "GT", "name": "Guatemala", "card_id": 2917864},
                    {"code": "GU", "name": "Guam", "card_id": 2917865},
                    {"code": "GW", "name": "Guinea-Bissau", "card_id": 2917866},
                    {"code": "GY", "name": "Guyana", "card_id": 2917867},
                    {"code": "HK", "name": "Hong Kong", "card_id": 2917868},
                    {
                      "code": "HM",
                      "name": "Heard Island and McDonald Islands",
                      "card_id": 2917869
                    },
                    {"code": "HN", "name": "Honduras", "card_id": 18094},
                    {"code": "HR", "name": "Croatia", "card_id": 2917870},
                    {"code": "HT", "name": "Haiti", "card_id": 2917871},
                    {"code": "HU", "name": "Hungary", "card_id": 45424},
                    {"code": "ID", "name": "Indonesia", "card_id": 14371},
                    {"code": "IE", "name": "Ireland", "card_id": 14394},
                    {"code": "IL", "name": "Israel", "card_id": 14701},
                    {"code": "IM", "name": "Isle of Man", "card_id": 2917872},
                    {"code": "IN", "name": "India", "card_id": 14389},
                    {
                      "code": "IO",
                      "name": "British Indian Ocean Territory",
                      "card_id": 2917873
                    },
                    {"code": "IQ", "name": "Iraq", "card_id": 3913},
                    {"code": "IR", "name": "Iran", "card_id": 2917874},
                    {"code": "IS", "name": "Iceland", "card_id": 2917875},
                    {"code": "IT", "name": "Italy", "card_id": 16175},
                    {"code": "JE", "name": "Jersey", "card_id": 2917876},
                    {"code": "JM", "name": "Jamaica", "card_id": 2917877},
                    {"code": "JO", "name": "Jordan", "card_id": 1812107},
                    {"code": "JP", "name": "Japan", "card_id": 14387},
                    {"code": "KE", "name": "Kenya", "card_id": 21392},
                    {"code": "KG", "name": "Kyrgyzstan", "card_id": 2917878},
                    {"code": "KH", "name": "Cambodia", "card_id": 13908},
                    {"code": "KI", "name": "Kiribati", "card_id": 2917879},
                    {"code": "KM", "name": "Comoros", "card_id": 2917880},
                    {"code": "KN", "name": "Saint Kitts and Nevis", "card_id": 2917881},
                    {
                      "code": "KP",
                      "name": "Korea, Democratic People's Republic of",
                      "card_id": 2917882
                    },
                    {"code": "KR", "name": "Korea, Republic of", "card_id": 2917883},
                    {"code": "KW", "name": "Kuwait", "card_id": 2917884},
                    {"code": "KY", "name": "Cayman Islands", "card_id": 2917885},
                    {"code": "KZ", "name": "Kazakhstan", "card_id": 2917886},
                    {"code": "LA", "name": "Laos", "card_id": 2917887},
                    {"code": "LB", "name": "Lebanon", "card_id": 2917888},
                    {"code": "LC", "name": "Saint Lucia", "card_id": 2917889},
                    {"code": "LI", "name": "Liechtenstein", "card_id": 2917890},
                    {"code": "LK", "name": "Sri Lanka", "card_id": 2917891},
                    {"code": "LR", "name": "Liberia", "card_id": 2917892},
                    {"code": "LS", "name": "Lesotho", "card_id": 2917893},
                    {"code": "LT", "name": "Lithuania", "card_id": 2917894},
                    {"code": "LU", "name": "Luxembourg", "card_id": 20766},
                    {"code": "LV", "name": "Latvia", "card_id": 2917895},
                    {"code": "LY", "name": "Libya", "card_id": 2917896},
                    {"code": "MA", "name": "Morocco", "card_id": 14426},
                    {"code": "MC", "name": "Monaco", "card_id": 2917897},
                    {"code": "MD", "name": "Moldova", "card_id": 2917898},
                    {"code": "ME", "name": "Montenegro", "card_id": 2917899},
                    {
                      "code": "MF",
                      "name": "Saint Martin (French part)",
                      "card_id": 2917900
                    },
                    {"code": "MG", "name": "Madagascar", "card_id": 40709},
                    {"code": "MH", "name": "Marshall Islands", "card_id": 2917901},
                    {"code": "MK", "name": "North Macedonia", "card_id": 2917902},
                    {"code": "ML", "name": "Mali", "card_id": 20033},
                    {"code": "MM", "name": "Myanmar", "card_id": 2917903},
                    {"code": "MN", "name": "Mongolia", "card_id": 2917904},
                    {"code": "MO", "name": "Macao", "card_id": 2917905},
                    {"code": "MP", "name": "Northern Mariana Islands", "card_id": 2917906},
                    {"code": "MQ", "name": "Martinique", "card_id": 2917907},
                    {"code": "MR", "name": "Mauritania", "card_id": 2917908},
                    {"code": "MS", "name": "Montserrat", "card_id": 2917909},
                    {"code": "MT", "name": "Malta", "card_id": 2917910},
                    {"code": "MU", "name": "Mauritius", "card_id": 2917911},
                    {"code": "MV", "name": "Maldives", "card_id": 2917912},
                    {"code": "MW", "name": "Malawi", "card_id": 14410},
                    {"code": "MX", "name": "Mexico", "card_id": 14403},
                    {"code": "MY", "name": "Malaysia", "card_id": 16948},
                    {"code": "MZ", "name": "Mozambique", "card_id": 2917913},
                    {"code": "NA", "name": "Namibia", "card_id": 2917914},
                    {"code": "NC", "name": "New Caledonia", "card_id": 2917915},
                    {"code": "NE", "name": "Niger", "card_id": 2917916},
                    {"code": "NF", "name": "Norfolk Island", "card_id": 2917917},
                    {"code": "NG", "name": "Nigeria", "card_id": 14384},
                    {"code": "NI", "name": "Nicaragua", "card_id": 2917918},
                    {"code": "NL", "name": "Netherlands", "card_id": 2917919},
                    {"code": "NO", "name": "Norway", "card_id": 2917920},
                    {"code": "NP", "name": "Nepal", "card_id": 45091},
                    {"code": "NR", "name": "Nauru", "card_id": 2917921},
                    {"code": "NU", "name": "Niue", "card_id": 2917922},
                    {"code": "NZ", "name": "New Zealand", "card_id": 2917923},
                    {"code": "OM", "name": "Oman", "card_id": 2917924},
                    {"code": "PA", "name": "Panama", "card_id": 2917925},
                    {"code": "PE", "name": "Peru", "card_id": 16184},
                    {"code": "PF", "name": "French Polynesia", "card_id": 2917926},
                    {"code": "PG", "name": "Papua New Guinea", "card_id": 16949},
                    {"code": "PH", "name": "Philippines", "card_id": 37238},
                    {"code": "PK", "name": "Pakistan", "card_id": 36162},
                    {"code": "PL", "name": "Poland", "card_id": 37189},
                    {"code": "PM", "name": "Saint Pierre and Miquelon", "card_id": 2917927},
                    {"code": "PN", "name": "Pitcairn", "card_id": 2917928},
                    {"code": "PR", "name": "Puerto Rico", "card_id": 2917929},
                    {"code": "PS", "name": "Palestinian Territory", "card_id": 2917930},
                    {"code": "PT", "name": "Portugal", "card_id": 2917931},
                    {"code": "PW", "name": "Palau", "card_id": 2917932},
                    {"code": "PY", "name": "Paraguay", "card_id": 2917933},
                    {"code": "QA", "name": "Qatar", "card_id": 168817},
                    {"code": "RE", "name": "Réunion", "card_id": 2917934},
                    {"code": "RO", "name": "Romania", "card_id": 13974},
                    {"code": "RS", "name": "Serbia", "card_id": 2917935},
                    {"code": "RU", "name": "Russia", "card_id": 35176},
                    {"code": "RW", "name": "Rwanda", "card_id": 2917936},
                    {"code": "SA", "name": "Saudi Arabia", "card_id": 43202},
                    {"code": "SB", "name": "Solomon Islands", "card_id": 2917937},
                    {"code": "SC", "name": "Seychelles", "card_id": 2917938},
                    {"code": "SD", "name": "Sudan", "card_id": 14149},
                    {"code": "SE", "name": "Sweden", "card_id": 43201},
                    {"code": "SG", "name": "Singapore", "card_id": 2917939},
                    {
                      "code": "SH",
                      "name": "Saint Helena, Ascension and Tristan da Cunha",
                      "card_id": 2917940
                    },
                    {"code": "SI", "name": "Slovenia", "card_id": 20157},
                    {"code": "SJ", "name": "Svalbard and Jan Mayen", "card_id": 2917941},
                    {"code": "SK", "name": "Slovakia", "card_id": 2917942},
                    {"code": "SL", "name": "Sierra Leone", "card_id": 2917943},
                    {"code": "SM", "name": "San Marino", "card_id": 2917944},
                    {"code": "SN", "name": "Senegal", "card_id": 15492},
                    {"code": "SO", "name": "Somalia", "card_id": 2917945},
                    {"code": "SR", "name": "Suriname", "card_id": 2917946},
                    {"code": "SS", "name": "South Sudan", "card_id": 2917947},
                    {"code": "ST", "name": "Sao Tome and Principe", "card_id": 2917948},
                    {"code": "SV", "name": "El Salvador", "card_id": 33639},
                    {"code": "SX", "name": "Sint Maarten (Dutch part)", "card_id": 2917949},
                    {"code": "SY", "name": "Syrian Arab Republic", "card_id": 2917950},
                    {"code": "SZ", "name": "Swaziland", "card_id": 2917951},
                    {"code": "TC", "name": "Turks and Caicos Islands", "card_id": 2917952},
                    {"code": "TD", "name": "Chad", "card_id": 2917953},
                    {
                      "code": "TF",
                      "name": "French Southern Territories",
                      "card_id": 2917954
                    },
                    {"code": "TG", "name": "Togo", "card_id": 2917955},
                    {"code": "TH", "name": "Thailand", "card_id": 14214},
                    {"code": "TJ", "name": "Tajikistan", "card_id": 2917956},
                    {"code": "TK", "name": "Tokelau", "card_id": 2917957},
                    {"code": "TL", "name": "Timor-Leste", "card_id": 2917958},
                    {"code": "TM", "name": "Turkmenistan", "card_id": 2917959},
                    {"code": "TN", "name": "Tunisia", "card_id": 2917960},
                    {"code": "TO", "name": "Tonga", "card_id": 2917961},
                    {"code": "TR", "name": "Turkey", "card_id": 13972},
                    {"code": "TT", "name": "Trinidad and Tobago", "card_id": 2917962},
                    {"code": "TV", "name": "Tuvalu", "card_id": 2917963},
                    {"code": "TW", "name": "Taiwan, Province of China", "card_id": 2917964},
                    {"code": "TZ", "name": "Tanzania", "card_id": 16808},
                    {"code": "UA", "name": "Ukraine", "card_id": 2917965},
                    {"code": "UG", "name": "Uganda", "card_id": 40396},
                    {
                      "code": "UM",
                      "name": "United States Minor Outlying Islands",
                      "card_id": 2917966
                    },
                    {"code": "US", "name": "United States", "card_id": 14551},
                    {"code": "UY", "name": "Uruguay", "card_id": 2918018},
                    {"code": "UZ", "name": "Uzbekistan", "card_id": 14412},
                    {
                      "code": "VA",
                      "name": "Holy See (Vatican City State)",
                      "card_id": 2918019
                    },
                    {
                      "code": "VC",
                      "name": "Saint Vincent and the Grenadines",
                      "card_id": 2918020
                    },
                    {"code": "VE", "name": "Venezuela", "card_id": 2918021},
                    {"code": "VG", "name": "British Virgin Islands", "card_id": 2918022},
                    {"code": "VI", "name": "U.S. Virgin Islands", "card_id": 2918023},
                    {"code": "VN", "name": "Vietnam", "card_id": 2918024},
                    {"code": "VU", "name": "Vanuatu", "card_id": 2918025},
                    {"code": "WF", "name": "Wallis and Futuna", "card_id": 2918026},
                    {"code": "WS", "name": "Samoa", "card_id": 2918027},
                    {"code": "XK", "name": "Kosovo", "card_id": 2918028},
                    {"code": "YE", "name": "Yemen", "card_id": 2918029},
                    {"code": "YT", "name": "Mayotte", "card_id": 2918030},
                    {"code": "ZA", "name": "South Africa", "card_id": 14938},
                    {"code": "ZM", "name": "Zambia", "card_id": 2918031},
                    {"code": "ZW", "name": "Zimbabwe", "card_id": 2918032}
                  ]
                },
                {
                  "name": "country_codes",
                  "values": [
                    {"name": "Afghanistan", "alpha-2": "AF", "country-code": "004"},
                    {"name": "Åland Islands", "alpha-2": "AX", "country-code": "248"},
                    {"name": "Albania", "alpha-2": "AL", "country-code": "008"},
                    {"name": "Algeria", "alpha-2": "DZ", "country-code": "012"},
                    {"name": "American Samoa", "alpha-2": "AS", "country-code": "016"},
                    {"name": "Andorra", "alpha-2": "AD", "country-code": "020"},
                    {"name": "Angola", "alpha-2": "AO", "country-code": "024"},
                    {"name": "Anguilla", "alpha-2": "AI", "country-code": "660"},
                    {"name": "Antarctica", "alpha-2": "AQ", "country-code": "010"},
                    {"name": "Antigua and Barbuda", "alpha-2": "AG", "country-code": "028"},
                    {"name": "Argentina", "alpha-2": "AR", "country-code": "032"},
                    {"name": "Armenia", "alpha-2": "AM", "country-code": "051"},
                    {"name": "Aruba", "alpha-2": "AW", "country-code": "533"},
                    {"name": "Australia", "alpha-2": "AU", "country-code": "036"},
                    {"name": "Austria", "alpha-2": "AT", "country-code": "040"},
                    {"name": "Azerbaijan", "alpha-2": "AZ", "country-code": "031"},
                    {"name": "Bahamas", "alpha-2": "BS", "country-code": "044"},
                    {"name": "Bahrain", "alpha-2": "BH", "country-code": "048"},
                    {"name": "Bangladesh", "alpha-2": "BD", "country-code": "050"},
                    {"name": "Barbados", "alpha-2": "BB", "country-code": "052"},
                    {"name": "Belarus", "alpha-2": "BY", "country-code": "112"},
                    {"name": "Belgium", "alpha-2": "BE", "country-code": "056"},
                    {"name": "Belize", "alpha-2": "BZ", "country-code": "084"},
                    {"name": "Benin", "alpha-2": "BJ", "country-code": "204"},
                    {"name": "Bermuda", "alpha-2": "BM", "country-code": "060"},
                    {"name": "Bhutan", "alpha-2": "BT", "country-code": "064"},
                    {
                      "name": "Bolivia (Plurinational State of)",
                      "alpha-2": "BO",
                      "country-code": "068"
                    },
                    {
                      "name": "Bonaire, Sint Eustatius and Saba",
                      "alpha-2": "BQ",
                      "country-code": "535"
                    },
                    {
                      "name": "Bosnia and Herzegovina",
                      "alpha-2": "BA",
                      "country-code": "070"
                    },
                    {"name": "Botswana", "alpha-2": "BW", "country-code": "072"},
                    {"name": "Bouvet Island", "alpha-2": "BV", "country-code": "074"},
                    {"name": "Brazil", "alpha-2": "BR", "country-code": "076"},
                    {
                      "name": "British Indian Ocean Territory",
                      "alpha-2": "IO",
                      "country-code": "086"
                    },
                    {"name": "Brunei Darussalam", "alpha-2": "BN", "country-code": "096"},
                    {"name": "Bulgaria", "alpha-2": "BG", "country-code": "100"},
                    {"name": "Burkina Faso", "alpha-2": "BF", "country-code": "854"},
                    {"name": "Burundi", "alpha-2": "BI", "country-code": "108"},
                    {"name": "Cabo Verde", "alpha-2": "CV", "country-code": "132"},
                    {"name": "Cambodia", "alpha-2": "KH", "country-code": "116"},
                    {"name": "Cameroon", "alpha-2": "CM", "country-code": "120"},
                    {"name": "Canada", "alpha-2": "CA", "country-code": "124"},
                    {"name": "Cayman Islands", "alpha-2": "KY", "country-code": "136"},
                    {
                      "name": "Central African Republic",
                      "alpha-2": "CF",
                      "country-code": "140"
                    },
                    {"name": "Chad", "alpha-2": "TD", "country-code": "148"},
                    {"name": "Chile", "alpha-2": "CL", "country-code": "152"},
                    {"name": "China", "alpha-2": "CN", "country-code": "156"},
                    {"name": "Christmas Island", "alpha-2": "CX", "country-code": "162"},
                    {
                      "name": "Cocos (Keeling) Islands",
                      "alpha-2": "CC",
                      "country-code": "166"
                    },
                    {"name": "Colombia", "alpha-2": "CO", "country-code": "170"},
                    {"name": "Comoros", "alpha-2": "KM", "country-code": "174"},
                    {"name": "Congo", "alpha-2": "CG", "country-code": "178"},
                    {
                      "name": "Congo, Democratic Republic of the",
                      "alpha-2": "CD",
                      "country-code": "180"
                    },
                    {"name": "Cook Islands", "alpha-2": "CK", "country-code": "184"},
                    {"name": "Costa Rica", "alpha-2": "CR", "country-code": "188"},
                    {"name": "Côte d'Ivoire", "alpha-2": "CI", "country-code": "384"},
                    {"name": "Croatia", "alpha-2": "HR", "country-code": "191"},
                    {"name": "Cuba", "alpha-2": "CU", "country-code": "192"},
                    {"name": "Curaçao", "alpha-2": "CW", "country-code": "531"},
                    {"name": "Cyprus", "alpha-2": "CY", "country-code": "196"},
                    {"name": "Czechia", "alpha-2": "CZ", "country-code": "203"},
                    {"name": "Denmark", "alpha-2": "DK", "country-code": "208"},
                    {"name": "Djibouti", "alpha-2": "DJ", "country-code": "262"},
                    {"name": "Dominica", "alpha-2": "DM", "country-code": "212"},
                    {"name": "Dominican Republic", "alpha-2": "DO", "country-code": "214"},
                    {"name": "Ecuador", "alpha-2": "EC", "country-code": "218"},
                    {"name": "Egypt", "alpha-2": "EG", "country-code": "818"},
                    {"name": "El Salvador", "alpha-2": "SV", "country-code": "222"},
                    {"name": "Equatorial Guinea", "alpha-2": "GQ", "country-code": "226"},
                    {"name": "Eritrea", "alpha-2": "ER", "country-code": "232"},
                    {"name": "Estonia", "alpha-2": "EE", "country-code": "233"},
                    {"name": "Eswatini", "alpha-2": "SZ", "country-code": "748"},
                    {"name": "Ethiopia", "alpha-2": "ET", "country-code": "231"},
                    {
                      "name": "Falkland Islands (Malvinas)",
                      "alpha-2": "FK",
                      "country-code": "238"
                    },
                    {"name": "Faroe Islands", "alpha-2": "FO", "country-code": "234"},
                    {"name": "Fiji", "alpha-2": "FJ", "country-code": "242"},
                    {"name": "Finland", "alpha-2": "FI", "country-code": "246"},
                    {"name": "France", "alpha-2": "FR", "country-code": "250"},
                    {"name": "French Guiana", "alpha-2": "GF", "country-code": "254"},
                    {"name": "French Polynesia", "alpha-2": "PF", "country-code": "258"},
                    {
                      "name": "French Southern Territories",
                      "alpha-2": "TF",
                      "country-code": "260"
                    },
                    {"name": "Gabon", "alpha-2": "GA", "country-code": "266"},
                    {"name": "Gambia", "alpha-2": "GM", "country-code": "270"},
                    {"name": "Georgia", "alpha-2": "GE", "country-code": "268"},
                    {"name": "Germany", "alpha-2": "DE", "country-code": "276"},
                    {"name": "Ghana", "alpha-2": "GH", "country-code": "288"},
                    {"name": "Gibraltar", "alpha-2": "GI", "country-code": "292"},
                    {"name": "Greece", "alpha-2": "GR", "country-code": "300"},
                    {"name": "Greenland", "alpha-2": "GL", "country-code": "304"},
                    {"name": "Grenada", "alpha-2": "GD", "country-code": "308"},
                    {"name": "Guadeloupe", "alpha-2": "GP", "country-code": "312"},
                    {"name": "Guam", "alpha-2": "GU", "country-code": "316"},
                    {"name": "Guatemala", "alpha-2": "GT", "country-code": "320"},
                    {"name": "Guernsey", "alpha-2": "GG", "country-code": "831"},
                    {"name": "Guinea", "alpha-2": "GN", "country-code": "324"},
                    {"name": "Guinea-Bissau", "alpha-2": "GW", "country-code": "624"},
                    {"name": "Guyana", "alpha-2": "GY", "country-code": "328"},
                    {"name": "Haiti", "alpha-2": "HT", "country-code": "332"},
                    {
                      "name": "Heard Island and McDonald Islands",
                      "alpha-2": "HM",
                      "country-code": "334"
                    },
                    {"name": "Holy See", "alpha-2": "VA", "country-code": "336"},
                    {"name": "Honduras", "alpha-2": "HN", "country-code": "340"},
                    {"name": "Hong Kong", "alpha-2": "HK", "country-code": "344"},
                    {"name": "Hungary", "alpha-2": "HU", "country-code": "348"},
                    {"name": "Iceland", "alpha-2": "IS", "country-code": "352"},
                    {"name": "India", "alpha-2": "IN", "country-code": "356"},
                    {"name": "Indonesia", "alpha-2": "ID", "country-code": "360"},
                    {
                      "name": "Iran (Islamic Republic of)",
                      "alpha-2": "IR",
                      "country-code": "364"
                    },
                    {"name": "Iraq", "alpha-2": "IQ", "country-code": "368"},
                    {"name": "Ireland", "alpha-2": "IE", "country-code": "372"},
                    {"name": "Isle of Man", "alpha-2": "IM", "country-code": "833"},
                    {"name": "Israel", "alpha-2": "IL", "country-code": "376"},
                    {"name": "Italy", "alpha-2": "IT", "country-code": "380"},
                    {"name": "Jamaica", "alpha-2": "JM", "country-code": "388"},
                    {"name": "Japan", "alpha-2": "JP", "country-code": "392"},
                    {"name": "Jersey", "alpha-2": "JE", "country-code": "832"},
                    {"name": "Jordan", "alpha-2": "JO", "country-code": "400"},
                    {"name": "Kazakhstan", "alpha-2": "KZ", "country-code": "398"},
                    {"name": "Kenya", "alpha-2": "KE", "country-code": "404"},
                    {"name": "Kiribati", "alpha-2": "KI", "country-code": "296"},
                    {
                      "name": "Korea (Democratic People's Republic of)",
                      "alpha-2": "KP",
                      "country-code": "408"
                    },
                    {"name": "Korea, Republic of", "alpha-2": "KR", "country-code": "410"},
                    {"name": "Kuwait", "alpha-2": "KW", "country-code": "414"},
                    {"name": "Kyrgyzstan", "alpha-2": "KG", "country-code": "417"},
                    {
                      "name": "Lao People's Democratic Republic",
                      "alpha-2": "LA",
                      "country-code": "418"
                    },
                    {"name": "Latvia", "alpha-2": "LV", "country-code": "428"},
                    {"name": "Lebanon", "alpha-2": "LB", "country-code": "422"},
                    {"name": "Lesotho", "alpha-2": "LS", "country-code": "426"},
                    {"name": "Liberia", "alpha-2": "LR", "country-code": "430"},
                    {"name": "Libya", "alpha-2": "LY", "country-code": "434"},
                    {"name": "Liechtenstein", "alpha-2": "LI", "country-code": "438"},
                    {"name": "Lithuania", "alpha-2": "LT", "country-code": "440"},
                    {"name": "Luxembourg", "alpha-2": "LU", "country-code": "442"},
                    {"name": "Macao", "alpha-2": "MO", "country-code": "446"},
                    {"name": "Madagascar", "alpha-2": "MG", "country-code": "450"},
                    {"name": "Malawi", "alpha-2": "MW", "country-code": "454"},
                    {"name": "Malaysia", "alpha-2": "MY", "country-code": "458"},
                    {"name": "Maldives", "alpha-2": "MV", "country-code": "462"},
                    {"name": "Mali", "alpha-2": "ML", "country-code": "466"},
                    {"name": "Malta", "alpha-2": "MT", "country-code": "470"},
                    {"name": "Marshall Islands", "alpha-2": "MH", "country-code": "584"},
                    {"name": "Martinique", "alpha-2": "MQ", "country-code": "474"},
                    {"name": "Mauritania", "alpha-2": "MR", "country-code": "478"},
                    {"name": "Mauritius", "alpha-2": "MU", "country-code": "480"},
                    {"name": "Mayotte", "alpha-2": "YT", "country-code": "175"},
                    {"name": "Mexico", "alpha-2": "MX", "country-code": "484"},
                    {
                      "name": "Micronesia (Federated States of)",
                      "alpha-2": "FM",
                      "country-code": "583"
                    },
                    {
                      "name": "Moldova, Republic of",
                      "alpha-2": "MD",
                      "country-code": "498"
                    },
                    {"name": "Monaco", "alpha-2": "MC", "country-code": "492"},
                    {"name": "Mongolia", "alpha-2": "MN", "country-code": "496"},
                    {"name": "Montenegro", "alpha-2": "ME", "country-code": "499"},
                    {"name": "Montserrat", "alpha-2": "MS", "country-code": "500"},
                    {"name": "Morocco", "alpha-2": "MA", "country-code": "504"},
                    {"name": "Mozambique", "alpha-2": "MZ", "country-code": "508"},
                    {"name": "Myanmar", "alpha-2": "MM", "country-code": "104"},
                    {"name": "Namibia", "alpha-2": "NA", "country-code": "516"},
                    {"name": "Nauru", "alpha-2": "NR", "country-code": "520"},
                    {"name": "Nepal", "alpha-2": "NP", "country-code": "524"},
                    {"name": "Netherlands", "alpha-2": "NL", "country-code": "528"},
                    {"name": "New Caledonia", "alpha-2": "NC", "country-code": "540"},
                    {"name": "New Zealand", "alpha-2": "NZ", "country-code": "554"},
                    {"name": "Nicaragua", "alpha-2": "NI", "country-code": "558"},
                    {"name": "Niger", "alpha-2": "NE", "country-code": "562"},
                    {"name": "Nigeria", "alpha-2": "NG", "country-code": "566"},
                    {"name": "Niue", "alpha-2": "NU", "country-code": "570"},
                    {"name": "Norfolk Island", "alpha-2": "NF", "country-code": "574"},
                    {"name": "North Macedonia", "alpha-2": "MK", "country-code": "807"},
                    {
                      "name": "Northern Mariana Islands",
                      "alpha-2": "MP",
                      "country-code": "580"
                    },
                    {"name": "Norway", "alpha-2": "NO", "country-code": "578"},
                    {"name": "Oman", "alpha-2": "OM", "country-code": "512"},
                    {"name": "Pakistan", "alpha-2": "PK", "country-code": "586"},
                    {"name": "Palau", "alpha-2": "PW", "country-code": "585"},
                    {"name": "Palestine, State of", "alpha-2": "PS", "country-code": "275"},
                    {"name": "Panama", "alpha-2": "PA", "country-code": "591"},
                    {"name": "Papua New Guinea", "alpha-2": "PG", "country-code": "598"},
                    {"name": "Paraguay", "alpha-2": "PY", "country-code": "600"},
                    {"name": "Peru", "alpha-2": "PE", "country-code": "604"},
                    {"name": "Philippines", "alpha-2": "PH", "country-code": "608"},
                    {"name": "Pitcairn", "alpha-2": "PN", "country-code": "612"},
                    {"name": "Poland", "alpha-2": "PL", "country-code": "616"},
                    {"name": "Portugal", "alpha-2": "PT", "country-code": "620"},
                    {"name": "Puerto Rico", "alpha-2": "PR", "country-code": "630"},
                    {"name": "Qatar", "alpha-2": "QA", "country-code": "634"},
                    {"name": "Réunion", "alpha-2": "RE", "country-code": "638"},
                    {"name": "Romania", "alpha-2": "RO", "country-code": "642"},
                    {"name": "Russian Federation", "alpha-2": "RU", "country-code": "643"},
                    {"name": "Rwanda", "alpha-2": "RW", "country-code": "646"},
                    {"name": "Saint Barthélemy", "alpha-2": "BL", "country-code": "652"},
                    {
                      "name": "Saint Helena, Ascension and Tristan da Cunha",
                      "alpha-2": "SH",
                      "country-code": "654"
                    },
                    {
                      "name": "Saint Kitts and Nevis",
                      "alpha-2": "KN",
                      "country-code": "659"
                    },
                    {"name": "Saint Lucia", "alpha-2": "LC", "country-code": "662"},
                    {
                      "name": "Saint Martin (French part)",
                      "alpha-2": "MF",
                      "country-code": "663"
                    },
                    {
                      "name": "Saint Pierre and Miquelon",
                      "alpha-2": "PM",
                      "country-code": "666"
                    },
                    {
                      "name": "Saint Vincent and the Grenadines",
                      "alpha-2": "VC",
                      "country-code": "670"
                    },
                    {"name": "Samoa", "alpha-2": "WS", "country-code": "882"},
                    {"name": "San Marino", "alpha-2": "SM", "country-code": "674"},
                    {
                      "name": "Sao Tome and Principe",
                      "alpha-2": "ST",
                      "country-code": "678"
                    },
                    {"name": "Saudi Arabia", "alpha-2": "SA", "country-code": "682"},
                    {"name": "Senegal", "alpha-2": "SN", "country-code": "686"},
                    {"name": "Serbia", "alpha-2": "RS", "country-code": "688"},
                    {"name": "Seychelles", "alpha-2": "SC", "country-code": "690"},
                    {"name": "Sierra Leone", "alpha-2": "SL", "country-code": "694"},
                    {"name": "Singapore", "alpha-2": "SG", "country-code": "702"},
                    {
                      "name": "Sint Maarten (Dutch part)",
                      "alpha-2": "SX",
                      "country-code": "534"
                    },
                    {"name": "Slovakia", "alpha-2": "SK", "country-code": "703"},
                    {"name": "Slovenia", "alpha-2": "SI", "country-code": "705"},
                    {"name": "Solomon Islands", "alpha-2": "SB", "country-code": "090"},
                    {"name": "Somalia", "alpha-2": "SO", "country-code": "706"},
                    {"name": "South Africa", "alpha-2": "ZA", "country-code": "710"},
                    {
                      "name": "South Georgia and the South Sandwich Islands",
                      "alpha-2": "GS",
                      "country-code": "239"
                    },
                    {"name": "South Sudan", "alpha-2": "SS", "country-code": "728"},
                    {"name": "Spain", "alpha-2": "ES", "country-code": "724"},
                    {"name": "Sri Lanka", "alpha-2": "LK", "country-code": "144"},
                    {"name": "Sudan", "alpha-2": "SD", "country-code": "729"},
                    {"name": "Suriname", "alpha-2": "SR", "country-code": "740"},
                    {
                      "name": "Svalbard and Jan Mayen",
                      "alpha-2": "SJ",
                      "country-code": "744"
                    },
                    {"name": "Sweden", "alpha-2": "SE", "country-code": "752"},
                    {"name": "Switzerland", "alpha-2": "CH", "country-code": "756"},
                    {
                      "name": "Syrian Arab Republic",
                      "alpha-2": "SY",
                      "country-code": "760"
                    },
                    {
                      "name": "Taiwan, Province of China",
                      "alpha-2": "TW",
                      "country-code": "158"
                    },
                    {"name": "Tajikistan", "alpha-2": "TJ", "country-code": "762"},
                    {
                      "name": "Tanzania, United Republic of",
                      "alpha-2": "TZ",
                      "country-code": "834"
                    },
                    {"name": "Thailand", "alpha-2": "TH", "country-code": "764"},
                    {"name": "Timor-Leste", "alpha-2": "TL", "country-code": "626"},
                    {"name": "Togo", "alpha-2": "TG", "country-code": "768"},
                    {"name": "Tokelau", "alpha-2": "TK", "country-code": "772"},
                    {"name": "Tonga", "alpha-2": "TO", "country-code": "776"},
                    {"name": "Trinidad and Tobago", "alpha-2": "TT", "country-code": "780"},
                    {"name": "Tunisia", "alpha-2": "TN", "country-code": "788"},
                    {"name": "Turkey", "alpha-2": "TR", "country-code": "792"},
                    {"name": "Turkmenistan", "alpha-2": "TM", "country-code": "795"},
                    {
                      "name": "Turks and Caicos Islands",
                      "alpha-2": "TC",
                      "country-code": "796"
                    },
                    {"name": "Tuvalu", "alpha-2": "TV", "country-code": "798"},
                    {"name": "Uganda", "alpha-2": "UG", "country-code": "800"},
                    {"name": "Ukraine", "alpha-2": "UA", "country-code": "804"},
                    {
                      "name": "United Arab Emirates",
                      "alpha-2": "AE",
                      "country-code": "784"
                    },
                    {
                      "name": "United Kingdom of Great Britain and Northern Ireland",
                      "alpha-2": "GB",
                      "country-code": "826"
                    },
                    {
                      "name": "United States of America",
                      "alpha-2": "US",
                      "country-code": "840"
                    },
                    {
                      "name": "United States Minor Outlying Islands",
                      "alpha-2": "UM",
                      "country-code": "581"
                    },
                    {"name": "Uruguay", "alpha-2": "UY", "country-code": "858"},
                    {"name": "Uzbekistan", "alpha-2": "UZ", "country-code": "860"},
                    {"name": "Vanuatu", "alpha-2": "VU", "country-code": "548"},
                    {
                      "name": "Venezuela (Bolivarian Republic of)",
                      "alpha-2": "VE",
                      "country-code": "862"
                    },
                    {"name": "Viet Nam", "alpha-2": "VN", "country-code": "704"},
                    {
                      "name": "Virgin Islands (British)",
                      "alpha-2": "VG",
                      "country-code": "092"
                    },
                    {
                      "name": "Virgin Islands (U.S.)",
                      "alpha-2": "VI",
                      "country-code": "850"
                    },
                    {"name": "Wallis and Futuna", "alpha-2": "WF", "country-code": "876"},
                    {"name": "Western Sahara", "alpha-2": "EH", "country-code": "732"},
                    {"name": "Yemen", "alpha-2": "YE", "country-code": "887"},
                    {"name": "Zambia", "alpha-2": "ZM", "country-code": "894"},
                    {"name": "Zimbabwe", "alpha-2": "ZW", "country-code": "716"}
                  ],
                  "format": {"type": "json", "parse": {"country-code": "number"}}
                },
                {
                  "name": "suppliers_per_country",
                  "source": "suppliers",
                  "transform": [
                    {
                      "type": "aggregate",
                      "groupby": ["country"],
                      "fields": ["name"],
                      "ops": ["count"],
                      "as": ["companies"]
                    },
                    {
                      "type": "lookup",
                      "from": "wikirate_countries",
                      "key": "name",
                      "fields": ["country"],
                      "values": ["code"],
                      "as": ["country_code"]
                    },
                    {
                      "type": "lookup",
                      "from": "country_codes",
                      "key": "alpha-2",
                      "fields": ["country_code"],
                      "values": ["country-code"],
                      "as": ["country_number"]
                    },
                    {
                      "type": "lookup",
                      "from": "world",
                      "key": "id",
                      "fields": ["country_number"],
                      "as": ["geo"]
                    },
                    {"type": "filter", "expr": "datum.geo"},
                    {
                      "type": "formula",
                      "as": "centroid",
                      "expr": "geoCentroid('projection', datum.geo)"
                    }
                  ]
                },
                {"name": "graticule", "transform": [{"type": "graticule"}]}
              ],
              "projections": [
                {
                  "name": "projection",
                  "type": {"signal": "type"},
                  "scale": {"signal": "scale"},
                  "rotate": [
                    {"signal": "rotate0"},
                    {"signal": "rotate1"},
                    {"signal": "rotate2"}
                  ],
                  "center": [
                    {"signal": "center0"},
                    {"signal": "center1"}
                  ],
                  "translate": [
                    {"signal": "translate0"},
                    {"signal": "translate1"}
                  ]
                }
              ],
              "scales": [
                {
                  "name": "size",
                  "domain": {"data": "suppliers_per_country", "field": "companies"},
                  "zero": false,
                  "range": [50, 2000]
                },
                {
                  "name": "color",
                  "type": "linear",
                  "nice": true,
                  "domain": {"data": "suppliers_per_country", "field": "companies"},
                  "range": ["#fef1eb", "#F7733D"]
                }
              ],
              "marks": [
                {
                  "type": "shape",
                  "from": {"data": "graticule"},
                  "encode": {
                    "update": {
                      "strokeWidth": {"value": 1},
                      "stroke": {"signal": "'#ddd'"},
                      "fill": {"value": null}
                    }
                  },
                  "transform": [
                    { "type": "geoshape", "projection": "projection" }
                  ]
                },
                {
                  "type": "shape",
                  "from": {"data": "world"},
                  "encode": {
                    "update": {
                      "strokeWidth": {"signal": "+borderWidth"},
                      "fill": {"value": "#171832"},
                      "zindex": {"value": 0}
                    }
                  },
                  "transform": [{"type": "geoshape", "projection": "projection"}]
                },
                {
                  "name": "circles",
                  "type": "symbol",
                  "from": {"data": "suppliers_per_country"},
                  "encode": {
                    "enter": {
                      "x": {"field": "centroid[0]"},
                      "y": {"field": "centroid[1]"},
                      "size": {"scale": "size", "field": "companies"},
                      "strokeWidth": {"value": 0.7},
                      "tooltip": {
                        "signal": "{'title': datum.country, 'Number of Companies': datum.companies}"
                      }
                    },
                    "update": {
                      "fill": {"scale": "color", "field": "companies"},
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
                        {"force": "x", "x": "datum.centroid[0]"},
                        {"force": "y", "y": "datum.centroid[1]"}
                      ]
                    }
                  ]
                }
              ],
              "legends": [
                {
                  "fill": "color",
                  "orient": "bottom-left",
                  "title": "No. of Suppliers"
                }
              ]
            }, {renderer:"svg"});
          }
        },
        error => {
        }
      )


  }

}
