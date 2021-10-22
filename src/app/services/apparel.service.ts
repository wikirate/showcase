import {EventEmitter, Injectable} from "@angular/core";
import companies from '../../assets/apparelTop100.json';
import {Company} from "../models/company.model";

@Injectable()
export class ApparelService {
  // @ts-ignore
  private companies: Company[] = companies;
  exploreMore = new EventEmitter<boolean>(false);

  getCompany(id: number) {
    const company = this.companies.find(
      (c) => {
        return c.id === id;
      }
    );
    return company;
  }

  getCompanies() {
    return this.companies.slice();
  }

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
