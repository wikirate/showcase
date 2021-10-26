import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicReportComponent} from "./dynamic-report/dynamic-report.component";
import {AboutComponent} from "./about/about.component";
import {CompanyResolver} from "./services/company-resolver.service";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {path: '', redirectTo: 'apparel_top_100/reports/0/latest', pathMatch: 'full'},
  {
    path: 'apparel_top_100/reports/:id/:year', component: DynamicReportComponent, resolve: {company: CompanyResolver}
  },
  {path: 'apparel_top_100/about', component: AboutComponent},
  { path: '**', redirectTo: '/apparel_top_100/reports/0/latest', pathMatch: 'full' }
];

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(
      routes
    )],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
