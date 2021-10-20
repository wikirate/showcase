import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicReportComponent} from "./dynamic-report/dynamic-report.component";
import {AboutComponent} from "./about/about.component";

const routes: Routes = [
  {path: '', redirectTo: 'apparel_top_100/reports/0/latest', pathMatch: 'full'},
  {
    path: 'apparel_top_100/reports/:id/:year', component: DynamicReportComponent
  },
  {path: 'apparel_top_100/about', component: AboutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
