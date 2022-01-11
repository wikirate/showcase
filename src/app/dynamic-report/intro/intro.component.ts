import {Component, ElementRef, ViewChild} from "@angular/core";
import { ViewportScroller } from '@angular/common';
import {ApparelService} from "../../services/apparel.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {animate, group, query, stagger, state, style, transition, trigger} from "@angular/animations";
// @ts-ignore
import logosjson from "../../../assets/logos.json";

@Component({
  selector: 'intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],

  animations: [
    trigger('slide-in', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 50ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-sm', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 150ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-md', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 250ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-lg', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 350ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ]),
    trigger('slide-in-delay-xl', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(50px)'}),
        animate('600ms 450ms', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ])
  ]
})
export class IntroComponent {
  logos: string[] = logosjson['logos'];
  selectedLogos: string[] = [];

  // @ts-ignore
  constructor(private apparelService: ApparelService, private modalService: NgbModal, private viewportScroller: ViewportScroller) {
  }

  ngOnInit(): void {
    this.selectedLogos = [];
    for (var i = 0; i <= 5; i++) {
      let randomLogo = "";
      do {
        randomLogo = this.logos[this.getRandomInt(20)];
      } while (this.selectedLogos.includes(randomLogo))
      this.selectedLogos.push(randomLogo)
    }
  }

  open(content: any) {
    this.modalService.open(content);
  }

  onExploreMore() {
    this.apparelService.setExploreMore();
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  onClick(anchorId: string) {
    this.viewportScroller.scrollToAnchor(anchorId);
  }
}

