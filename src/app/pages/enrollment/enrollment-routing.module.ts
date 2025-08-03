import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { EnrollmentComponent } from './enrollment.component';
import { EnrollmentListComponent } from './enrollment-list/enrollment-list.component';
import { EnrollmentFormComponent } from './enrollment-form/enrollment-form.component';

const routes: Routes = [
  {
    path: '',
    component: EnrollmentComponent,
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
        component: EnrollmentListComponent,
      },
      {
        path: 'create',
        component: EnrollmentFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: EnrollmentFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: EnrollmentFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrollmentRoutingModule {}

export const routedComponents = [EnrollmentComponent, EnrollmentListComponent, EnrollmentFormComponent];
