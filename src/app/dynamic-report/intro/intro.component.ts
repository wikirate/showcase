import {Component, ElementRef, ViewChild} from "@angular/core";
import {ApparelService} from "../../services/apparel.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
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

