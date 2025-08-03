import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPagesComponent } from './error-pages.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorPagesComponent,
    children: [
      {
        path: '401',
        component: UnauthorizedComponent,
      },
      {
        path: '403',
        component: ForbiddenComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '500',
        component: InternalServerErrorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorPagesRoutingModule {}
