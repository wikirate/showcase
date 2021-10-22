import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Params, Router} from "@angular/router";
import {ApparelService} from "../services/apparel.service";
import {Company} from "../models/company.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  paramsSubscription!: Subscription;
  exploreMore: boolean = false;
  apparelTop100: Company[] = [];
  searchText: any;
  selectedYear: string | number | null = 'latest';
  selectedCompany!: string;
  // @ts-ignore
  @ViewChild('search_text') search_text: ElementRef;

  // @ts-ignore
  report_params: { year: number | null | string, id: number | null | string };

  constructor(private route: ActivatedRoute, private router: Router, private apparelService: ApparelService) {
    this.apparelTop100 = apparelService.getCompanies();
  }

  ngOnInit(): void {
    this.report_params = {
      id: 0,
      year: 'latest'
    }
    this.apparelService.exploreMore.subscribe((explore: boolean) => {
      this.exploreMore = explore;
    })
  }


  setValue(company: Company) {
    this.search_text.nativeElement.value = company.name
    this.report_params.id = company.id;
    if (company === null) {
      this.search_text.nativeElement.value = 'overview'
      this.report_params.id = 0;
    }
  }

  navigateTo(event: Event) {
    let value = (<HTMLSelectElement>event.target).value;
    if (value) {
      if (this.report_params.id === null)
        this.report_params.id = 0;
      this.router.navigate(['/apparel_top_100/reports/' + this.report_params.id + "/" + value]);
    }
    return false;
  }

}
