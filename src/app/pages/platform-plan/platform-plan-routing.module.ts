import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { PlatformPlanComponent } from './platform-plan.component';
import { PlatformPlanListComponent } from './platform-plan-list/platform-plan-list.component';
import { PlatformPlanFormComponent } from './platform-plan-form/platform-plan-form.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformPlanComponent,
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
        component: PlatformPlanListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformPlanRoutingModule {}

export const routedComponents = [PlatformPlanComponent, PlatformPlanFormComponent, PlatformPlanListComponent];
