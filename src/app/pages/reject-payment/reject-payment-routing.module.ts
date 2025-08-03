import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { RejectPaymentComponent } from './reject-payment.component';
import { RejectPaymentListComponent } from './reject-payment-list/reject-payment-list.component';
import { StatementAccountFormComponent } from '../statement-account/statement-account-form/statement-account-form.component';
import { RejectCommentDialogComponent } from './reject-comment-form/reject-comment-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: RejectPaymentComponent,
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
        component: RejectPaymentListComponent,
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
export class RejectPaymentRoutingModule {}

export const routedComponents = [RejectPaymentComponent, RejectPaymentListComponent, RejectCommentDialogComponent];
