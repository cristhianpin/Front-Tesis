import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { PendingPaymentComponent } from './pending-payment.component';
import { PendingPaymentListComponent } from './pending-payment-list/pending-payment-list.component';
import { StatementAccountFormComponent } from '../statement-account/statement-account-form/statement-account-form.component';
import { RejectDialogComponent } from './pending-payment-status/reject/reject-dialog.component';
import { ApprovalDialogComponent } from './pending-payment-status/approval/approval-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: PendingPaymentComponent,
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
        component: PendingPaymentListComponent,
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
export class PendingPaymentRoutingModule {}

export const routedComponents = [
  PendingPaymentComponent,
  PendingPaymentListComponent,
  RejectDialogComponent,
  ApprovalDialogComponent,
];
