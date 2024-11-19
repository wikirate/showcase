import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {IntroComponent} from './dynamic-report/intro/intro.component';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SuppliersMapComponent} from './dynamic-report/suppliers-map/suppliers-map.component';
import {DynamicReportComponent} from './dynamic-report/dynamic-report.component';
import { MarketCapMapComponent } from './dynamic-report/market-cap-map/market-cap-map.component';
import { SupplierListsOnWikirateComponent } from './dynamic-report/supplier-lists-on-wikirate/supplier-lists-on-wikirate.component';
import { NumberOfSuppliersPerCompanyComponent } from './dynamic-report/number-of-suppliers-per-company/number-of-suppliers-per-company.component';
import {RouterModule} from "@angular/router";
import { FooterComponent } from './footer/footer.component';
import { MoreDataComponent } from './dynamic-report/more-data/more-data.component';
import { AboutComponent } from './about/about.component';
import {ApparelService} from "./services/apparel.service";
import { FilterPipe } from './pipes/filter.pipe';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TextHighlightDirective} from './directives/text-highlight.directive';
import {CompanyResolver} from "./services/company-resolver.service";
import {BigNumberFormatPipe} from "./pipes/big-number-format.pipe";
import {NumFormatPipe} from "./pipes/num-format.pipe";
import { EsgPerformanceComponent } from './dynamic-report/esg-performance/esg-performance.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EsgDisclosureRatesComponent } from './dynamic-report/esg-disclosure-rates/esg-disclosure-rates.component';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        IntroComponent,
        SuppliersMapComponent,
        DynamicReportComponent,
        MarketCapMapComponent,
        SupplierListsOnWikirateComponent,
        NumberOfSuppliersPerCompanyComponent,
        FooterComponent,
        MoreDataComponent,
        AboutComponent,
        FilterPipe,
        BigNumberFormatPipe,
        NumFormatPipe,
        TextHighlightDirective,
        EsgPerformanceComponent,
        EsgDisclosureRatesComponent
    ],
    bootstrap: [AppComponent], 
    imports: [FormsModule,
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        NgbModule,
        BrowserAnimationsModule
    ], 
    providers: [ApparelService, CompanyResolver, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
