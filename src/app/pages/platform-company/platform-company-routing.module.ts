import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { PlatformCompanyComponent } from './platform-company.component';
import { PlatformCompanyListComponent } from './platform-company-list/platform-company-list.component';
import { PlatformCompanyFormComponent } from './platform-company-form/platform-company-form.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformCompanyComponent,
    canActivate: [AuthenticationGuard],
    data: {
      roles: [RoleEnum.ROOT, RoleEnum.ADMINISTRADOR, RoleEnum.ESTUDIANTE],
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: PlatformCompanyListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformCompanyRoutingModule {}

export const routedComponents = [PlatformCompanyComponent, PlatformCompanyFormComponent, PlatformCompanyListComponent];
