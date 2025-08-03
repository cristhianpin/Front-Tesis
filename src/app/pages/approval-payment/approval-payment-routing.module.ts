import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { ApprovalPaymentComponent } from './approval-payment.component';
import { ApprovalPaymentListComponent } from './approval-payment-list/approval-payment-list.component';
import { StatementAccountFormComponent } from '../statement-account/statement-account-form/statement-account-form.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalPaymentComponent,
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
        component: ApprovalPaymentListComponent,
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
export class ApprovalPaymentRoutingModule {}

export const routedComponents = [ApprovalPaymentComponent, ApprovalPaymentListComponent];
