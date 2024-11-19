import {Company} from "../models/company.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {Observable} from "rxjs";
import {ApparelService} from "./apparel.service";
import {Injectable} from "@angular/core";

@Injectable()
export class CompanyResolver  {
  constructor(private apparelService: ApparelService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Company> | Promise<Company> | Company {
    // @ts-ignore
    return this.apparelService.getCompany(+route.params['id']);
  }

}
