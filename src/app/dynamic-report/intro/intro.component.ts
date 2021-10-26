import {Component, ElementRef, ViewChild} from "@angular/core";
import {ApparelService} from "../../services/apparel.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {animate, group, query, stagger, state, style, transition, trigger} from "@angular/animations";
import {delay} from "rxjs/operators";

@Component({
  selector: 'intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],

  animations: [
    trigger('slide-in', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-sm', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 100ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-md', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 150ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-lg', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 200ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-xl', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 250ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ])
  ]
})
export class IntroComponent {

  // @ts-ignore
  constructor(private apparelService: ApparelService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content);
  }

  onExploreMore() {
    this.apparelService.setExploreMore();
  }
}

