import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Event, Router} from "@angular/router";
import {ApparelService} from "../services/apparel.service";
import {Company} from "../models/company.model";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {Observable, Subject, merge, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'Compiling the Public Picture: The Apparel Top 100 Case';
  exploreMore: boolean = false;
  apparelTop100: Company[] = [];
  searchText: any;
  // @ts-ignore
  @ViewChild('search_text') search_text: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apparelService: ApparelService) {
    this.apparelTop100 = apparelService.companies;
  }

  ngOnInit(): void {
    this.apparelService.exploreMore.subscribe((explore: boolean) => {
      this.exploreMore = explore;
    })
  }

  setValue(company: Company) {
    this.search_text.nativeElement.value = company.name
  }

}
