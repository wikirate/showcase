import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicReportComponent} from "./dynamic-report/dynamic-report.component";
import {AboutComponent} from "./about/about.component";
import { LocationStrategy, PathLocationStrategy} from '@angular/common';

const routes: Routes = [
  {path: 'apparel_top_100/reports/0/latest', redirectTo: '/apparel_top_100/home', pathMatch: 'full'},
  {
    path: 'apparel_top_100/home', component: DynamicReportComponent,
  },
  {path: 'apparel_top_100/about', component: AboutComponent},
  {path: '**', redirectTo: '/apparel_top_100/home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {anchorScrolling: "enabled"}
    )],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
