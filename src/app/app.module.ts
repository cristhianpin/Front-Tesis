/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF, CurrencyPipe, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTInterceptor } from '@nebular/auth';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { CoreModule } from './@core/core.module';
import { Logo } from './@core/shared/classes/logo';
import { GlobalErrorHandler } from './@core/shared/error/global-error-handler';
import { AuthenticationGuard } from './@core/shared/guard/authentication.guard';
import { ServiceInjectorModule } from './@core/shared/injector/service-injector.module';
import { AuthorizationInterceptor } from './@core/shared/interceptor/authorization.interceptor';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// const JWT_REFRESH_URL = `${environment.REST_AUTH_URL}jwt/refresh`;
const JWT_REFRESH_URL = `${environment.REST_URL}auth/refresh`;

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceInjectorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'es',
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: `${environment.REST_URL}logs`,
      level: environment.LOG_LEVEL,
      serverLogLevel: environment.SERVER_LOG_LEVEL,
      disableConsoleLogging: environment.DISABLE_CONSOLE_LOGGING,
      enableSourceMaps: environment.ENABLE_SOURCE_MAPS,
      disableFileDetails: environment.DISABLE_FILE_DETAILS,
    }),
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    // // NbChatModule.forRoot({
    // //   messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    // // }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthenticationGuard,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
    {
      provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
      useValue: function (req: HttpRequest<any>): boolean {
        return req.url === JWT_REFRESH_URL;
      },
    },
    Logo,
    DecimalPipe,
    CurrencyPipe,
  ],
})
export class AppModule {}
