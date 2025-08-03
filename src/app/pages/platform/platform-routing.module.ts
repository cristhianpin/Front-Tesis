import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { PlatformFormComponent } from './platform-form/platform-form.component';
import { PlatformListComponent } from './platform-list/platform-list.component';
import { PlatformComponent } from './platform.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformComponent,
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
        component: PlatformListComponent,
      },
      {
        path: 'create',
        component: PlatformFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: PlatformFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: PlatformFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformRoutingModule {}

export const routedComponents = [PlatformComponent, PlatformListComponent, PlatformFormComponent];
