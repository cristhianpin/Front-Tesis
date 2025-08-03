import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyComponent } from './company.component';
import { UserRegisterFormComponent } from './user-register-form/user-register-form.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
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
        component: CompanyListComponent,
      },
      {
        path: 'create',
        component: CompanyFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: CompanyFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: CompanyFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}

export const routedComponents = [CompanyComponent, CompanyListComponent, CompanyFormComponent, UserRegisterFormComponent];
