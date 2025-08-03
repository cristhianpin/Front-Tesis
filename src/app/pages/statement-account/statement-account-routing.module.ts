import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { StatementAccountComponent } from './statement-account.component';
import { StatementAccountListComponent } from './statement-account-list/statement-account-list.component';
import { StatementAccountFormComponent } from './statement-account-form/statement-account-form.component';
import { CustomerComponent } from './statement-account-tab/customer/customer.component';
import { AccountComponent } from './statement-account-tab/account/account.component';
import { PendingComponent } from './statement-account-tab/pending/pending.component';
import { ApprovedComponent } from './statement-account-tab/approved/approved.component';
import { RejectComponent } from './statement-account-tab/reject/reject.component';

const routes: Routes = [
  {
    path: '',
    component: StatementAccountComponent,
    canActivate: [AuthenticationGuard],
    data: {
      roles: [RoleEnum.ADMINISTRADOR],
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: StatementAccountListComponent,
      },
      {
        path: 'create',
        component: StatementAccountFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: StatementAccountFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: StatementAccountFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatementAccountRoutingModule {}

export const routedComponents = [
  StatementAccountComponent,
  StatementAccountListComponent,
  StatementAccountFormComponent,
  CustomerComponent,
  AccountComponent,
  PendingComponent,
  ApprovedComponent,
  RejectComponent,
];
