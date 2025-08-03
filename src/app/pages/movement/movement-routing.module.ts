import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { MovementComponent } from './movement.component';
import { MovementListComponent } from './movement-list/movement-list.component';
import { MovementFormComponent } from './movement-form/movement-form.component';

const routes: Routes = [
  {
    path: '',
    component: MovementComponent,
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
        component: MovementListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovementRoutingModule {}

export const routedComponents = [MovementComponent, MovementFormComponent, MovementListComponent];
