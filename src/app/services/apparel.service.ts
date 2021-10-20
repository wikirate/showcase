import {EventEmitter, Injectable} from "@angular/core";
import companies from '../../assets/apparelTop100.json';
import {Company} from "../models/company.model";

@Injectable()
export class ApparelService {
  public companies: Company[] = companies;
  exploreMore = new EventEmitter<boolean>(false);

  setExploreMore() {
    // @ts-ignore
    this.exploreMore.emit(true);
    setTimeout(() => {
      this.unsetExploreMore()
    }, 3000)
  }

  unsetExploreMore() {
    // @ts-ignore
    this.exploreMore.emit(false);
  }
}
