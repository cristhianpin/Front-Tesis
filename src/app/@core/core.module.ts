import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  NbAuthJWTToken,
  NbAuthModule,
  NbPasswordAuthStrategy
} from '@nebular/auth';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';
import { Observable, of as observableOf } from 'rxjs';

import { environment } from '../../environments/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnalyticsService, LayoutService, PlayerService, SeoService, StateService } from './utils';

const JWT_SIGN_IN_URL = 'auth/login-admin';
const JWT_SIGN_UP_URL = 'auth/sign-up';
const JWT_SIGN_OUT_URL = 'auth/logout';
const JWT_REFRESH_URL = 'auth/refresh';

const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole(): Observable<string> {
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: environment.REST_URL,
        login: {
          alwaysFail: false,
          endpoint: JWT_SIGN_IN_URL,
          requireValidToken: false,
          method: 'post',
          redirect: {
            success: null,
            failure: null,
          },
          defaultErrors: ['Algo salió mal, por favor intente de nuevo.'],
          defaultMessages: ['Ha ingresado al sistema exitosamente.'],
        },
        register: {
          alwaysFail: false,
          endpoint: JWT_SIGN_UP_URL,
          method: 'post',
          requireValidToken: false,
          redirect: {
            success: '/authentication/sign-in',
            failure: null,
          },

          defaultErrors: ['Algo salió mal, por favor intente de nuevo.'],
          defaultMessages: ['Se ha registrado exitosamente.'],
        },
        logout: {
          alwaysFail: false,
          endpoint: JWT_SIGN_OUT_URL,
          method: 'post',
          redirect: {
            success: '/authentication/sign-in',
            failure: null,
          },
          defaultErrors: ['Algo salió mal, por favor intente de nuevo.'],
          defaultMessages: ['Ha salido del sistema exitosamente.'],
          requireValidToken: true,
        },
        refreshToken: {
          endpoint: JWT_REFRESH_URL,
          method: 'post',
        },
        requestPass: {
          endpoint: '/auth/request-pass',
          method: 'post',
        },
        resetPass: {
          endpoint: '/auth/reset-pass',
          method: 'post',
        },
        token: {
          class: NbAuthJWTToken,
          key: 'data.token',
        },
        messages: {
          key: 'message',
        },
        errors: {
          key: 'message',
        },
      }),
    ],
    forms: {
      login: {
        socialLinks: socialLinks,
      },
      register: {
        socialLinks: socialLinks,
      },
      validation: {
        email: {
          required: true,
        },
        password: {
          required: true,
          minLength: 8,
          maxLength: 50,
        },
        code: {
          required: true,
          minLength: 6,
          maxLength: 6,
        },
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider,
    useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
