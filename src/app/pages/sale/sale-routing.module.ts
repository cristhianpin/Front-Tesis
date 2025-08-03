import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { SaleFormComponent } from './sale-form/sale-form.component';
import { SaleListComponent } from './sale-list/sale-list.component';
import { SaleComponent } from './sale.component';

const routes: Routes = [
  {
    path: '',
    component: SaleComponent,
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
        component: SaleListComponent,
      },
      {
        path: 'create',
        component: SaleFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: SaleFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: SaleFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleRoutingModule {}

export const routedComponents = [SaleComponent, SaleListComponent, SaleFormComponent];
