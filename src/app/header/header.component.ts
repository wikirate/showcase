import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivationEnd, ParamMap, Router} from "@angular/router";
import {ApparelService} from "../services/apparel.service";
import {Company} from "../models/company.model";
import {Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";

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

    this.router.events
      .pipe(
        filter(e => (e instanceof ActivationEnd) && (Object.keys(e.snapshot.params).length > 0)),
        map(e => e instanceof ActivationEnd ? e.snapshot.params : {})
      )
      .subscribe(params => {
        this.report_params['id'] = params['id']
        this.report_params['year'] = params['year']
        // @ts-ignore
        this.selectedCompany = this.apparelService.getCompany(+this.report_params.id).name
      });

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

  navigateToYear(event: Event) {
    let value = (<HTMLSelectElement>event.target).value;
    if (value) {
      if (this.report_params.id === null)
        this.report_params.id = 0;
      this.router.navigate(['/apparel_top_100/reports/' + this.report_params.id + "/" + value]);
    }
  }

  navigateToCompany(c: Company) {
    this.router.navigate(['/apparel_top_100/reports/' + c.id + "/" + this.report_params.year]);
  }

}
