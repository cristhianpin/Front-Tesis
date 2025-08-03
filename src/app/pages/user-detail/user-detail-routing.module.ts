import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { UserDetailComponent } from './user-detail.component';
import { UserDetailListComponent } from './user-detail-list/user-detail-list.component';
import { UserDetailFormComponent } from './user-detail-form/user-detail-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserDetailComponent,
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
        component: UserDetailListComponent,
      },
      {
        path: 'create',
        component: UserDetailFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: UserDetailFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: UserDetailFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailRoutingModule {}

export const routedComponents = [UserDetailComponent, UserDetailListComponent, UserDetailFormComponent];
