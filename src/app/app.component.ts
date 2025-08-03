/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService,
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private iconLibraries: NbIconLibraries,
  ) {
    this.iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa',
    });
    this.iconLibraries.registerFontPack('far', {
      packClass: 'far',
      iconClassPrefix: 'fa',
    });
    this.iconLibraries.registerFontPack('fab', {
      packClass: 'fab',
      iconClassPrefix: 'fa',
    });
    this.iconLibraries.setDefaultPack('far');
  }

  ngOnInit(): void {
    this.initTranslateValues();
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }

  private initTranslateValues(): void {
    this.translateService.addLangs(['en', 'es']);
    this.translatePrimeNG();
  }

  private translatePrimeNG(): void {
    this.translateService.get('primeng').subscribe((res) => this.config.setTranslation(res));
  }
}
