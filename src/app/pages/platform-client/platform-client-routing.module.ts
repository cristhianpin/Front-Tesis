import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { PlatformClientComponent } from './platform-client.component';
import { PlatformClientListComponent } from './platform-client-list/platform-client-list.component';
import { PlatformClientFormSaleComponent } from './platform-client-form-sale/platform-client-form-sale.component';
import { PlatformClientFormViewComponent } from './platform-client-form-view/platform-client-form-view.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformClientComponent,
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
        component: PlatformClientListComponent,
      },
      // {
      //   path: 'create',
      //   component: PlatformClientFormComponent,
      //   data: { operation: 'C' },
      // },
      // {
      //   path: 'view/:objId',
      //   component: PlatformClientFormComponent,
      //   data: { operation: 'R' },
      // },
      // {
      //   path: 'edit/:objId',
      //   component: PlatformClientFormComponent,
      //   data: { operation: 'U' },
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformClientRoutingModule {}

export const routedComponents = [
  PlatformClientComponent,
  PlatformClientListComponent,
  PlatformClientFormSaleComponent,
  PlatformClientFormViewComponent,
];
