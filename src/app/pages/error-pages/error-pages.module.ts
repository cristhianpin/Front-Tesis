import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ErrorPagesRoutingModule } from './error-pages-routing.module';
import { ErrorPagesComponent } from './error-pages.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  imports: [ThemeModule, NbCardModule, NbButtonModule, ErrorPagesRoutingModule],
  declarations: [
    ErrorPagesComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    ForbiddenComponent,
    InternalServerErrorComponent,
  ],
})
export class ErrorPagesModule {}
