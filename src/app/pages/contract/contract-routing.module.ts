import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { ContractComponent } from './contract.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractFormComponent } from './contract-form/contract-form.component';

const routes: Routes = [
  {
    path: '',
    component: ContractComponent,
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
        component: ContractListComponent,
      },
      {
        path: 'create',
        component: ContractFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: ContractFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: ContractFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRoutingModule {}

export const routedComponents = [ContractComponent, ContractListComponent, ContractFormComponent];
