import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPagesModule } from './error-pages/error-pages.module';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { PagesComponent } from './pages.component';
import { MyAccountModule } from './my-account/my-account.module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { ClientDetailModule } from './client-detail/client-detail.module';
import { StatementAccountModule } from './statement-account/statement-account.module';
import { PendingPaymentModule } from './pending-payment/pending-payment.module';
import { RejectPaymentModule } from './reject-payment/reject-payment.module';
import { SettingModule } from './setting/setting.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { RegistrationModule } from './registration/registration.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContractModule } from './contract/contract.module';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'users',
        loadChildren: (): Promise<UserDetailModule> =>
          import('./user-detail/user-detail.module').then((m) => m.UserDetailModule),
      },
      {
        path: 'courses',
        loadChildren: (): Promise<CourseModule> => import('./course/course.module').then((m) => m.CourseModule),
      },
      {
        path: 'enrollments',
        loadChildren: (): Promise<EnrollmentModule> => import('./enrollment/enrollment.module').then((m) => m.EnrollmentModule),
      },
      {
        path: 'contracts',
        loadChildren: (): Promise<ContractModule> => import('./contract/contract.module').then((m) => m.ContractModule),
      },

      {
        path: 'clients',
        loadChildren: (): Promise<ClientDetailModule> =>
          import('./client-detail/client-detail.module').then((m) => m.ClientDetailModule),
      },
      {
        path: 'statement-account',
        loadChildren: (): Promise<StatementAccountModule> =>
          import('./statement-account/statement-account.module').then((m) => m.StatementAccountModule),
      },
      {
        path: 'pending-payment',
        loadChildren: (): Promise<PendingPaymentModule> =>
          import('./pending-payment/pending-payment.module').then((m) => m.PendingPaymentModule),
      },
      {
        path: 'reject-payment',
        loadChildren: (): Promise<RejectPaymentModule> =>
          import('./reject-payment/reject-payment.module').then((m) => m.RejectPaymentModule),
      },
      {
        path: 'my-account',
        loadChildren: (): Promise<MyAccountModule> => import('./my-account/my-account.module').then((m) => m.MyAccountModule),
      },
      {
        path: 'settings',
        loadChildren: (): Promise<SettingModule> => import('./setting/setting.module').then((m) => m.SettingModule),
      },
      {
        path: 'registration',
        loadChildren: (): Promise<RegistrationModule> =>
          import('./registration/registration.module').then((m) => m.RegistrationModule),
      },
      {
        path: 'dashboard',
        loadChildren: (): Promise<DashboardModule> => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      // {
      //   path: 'iot-dashboard',
      //   data: {
      //     roles: [RoleEnum.ROOT, RoleEnum.ADMINISTRADOR, RoleEnum.ESTUDIANTE],
      //   },
      //   component: DashboardComponent,
      // },
      // {
      //   path: 'ft',
      //   loadChildren: (): Promise<FTModule> => import('./ft/ft.module').then((m) => m.FTModule),
      // },
      {
        path: 'error-pages',
        loadChildren: (): Promise<ErrorPagesModule> =>
          import('./error-pages/error-pages.module').then((m) => m.ErrorPagesModule),
      },
      // {
      //   path: 'country',
      //   loadChildren: (): Promise<CountryModule> => import('./country/country.module').then((m) => m.CountryModule),
      // },
      // {
      //   path: 'tax',
      //   loadChildren: (): Promise<TaxModule> => import('./tax/tax.module').then((m) => m.TaxModule),
      // },
      // {
      //   path: 'commission-rate',
      //   loadChildren: (): Promise<CommissionRateModule> =>
      //     import('./commission-rate/commission-rate.module').then((m) => m.CommissionRateModule),
      // },
      // {
      //   path: 'workflow',
      //   loadChildren: (): Promise<WorkflowModule> => import('./workflow/workflow.module').then((m) => m.WorkflowModule),
      // },
      // {
      //   path: 'change-position-accounting',
      //   loadChildren: (): Promise<ChangePositionAccountingModule> =>
      //     import('./change-position-accounting/change-position-accounting.module').then(
      //       (m) => m.ChangePositionAccountingModule,
      //     ),
      // },
      // {
      //   path: 'currency',
      //   loadChildren: (): Promise<CurrencyModule> => import('./currency/currency.module').then((m) => m.CurrencyModule),
      // },
      // {
      //   path: 'account-type',
      //   loadChildren: (): Promise<AccountTypeModule> =>
      //     import('./account-type/account-type.module').then((m) => m.AccountTypeModule),
      // },
      // {
      //   path: 'account',
      //   loadChildren: (): Promise<AccountModule> => import('./account/account.module').then((m) => m.AccountModule),
      // },
      // {
      //   path: 'sale',
      //   loadChildren: (): Promise<SaleModule> => import('./sale/sale.module').then((m) => m.SaleModule),
      // },
      // {
      //   path: 'booking',
      //   loadChildren: (): Promise<BookingModule> => import('./booking/booking.module').then((m) => m.BookingModule),
      // },
      // {
      //   path: 'platform-client',
      //   loadChildren: (): Promise<PlatformClientModule> =>
      //     import('./platform-client/platform-client.module').then((m) => m.PlatformClientModule),
      // },
      // {
      //   path: 'client-account',
      //   loadChildren: (): Promise<ClientAccountModule> =>
      //     import('./client-account/client-account.module').then((m) => m.ClientAccountModule),
      // },
      // {
      //   path: 'registered-bank',
      //   loadChildren: (): Promise<RegisteredBankModule> =>
      //     import('./registered-bank/registered-bank.module').then((m) => m.RegisteredBankModule),
      // },
      // {
      //   path: 'attachment-type',
      //   loadChildren: (): Promise<AttachmentTypeModule> =>
      //     import('./attachment-type/attachment-type.module').then((m) => m.AttachmentTypeModule),
      // },
      // {
      //   path: 'company',
      //   loadChildren: (): Promise<CompanyModule> => import('./company/company.module').then((m) => m.CompanyModule),
      // },
      // {
      //   path: 'platform',
      //   loadChildren: (): Promise<PlatformModule> => import('./platform/platform.module').then((m) => m.PlatformModule),
      // },
      // {
      //   path: 'ticket',
      //   loadChildren: (): Promise<TicketModule> => import('./ticket/ticket.module').then((m) => m.TicketModule),
      // },
      // {
      //   path: 'movement',
      //   loadChildren: (): Promise<MovementModule> => import('./movement/movement.module').then((m) => m.MovementModule),
      // },
      // // {
      // //   path: 'platform-company',
      // //   loadChildren: (): Promise<PlatformCompanyModule> =>
      // //     import('./platform-company/platform-company.module').then((m) => m.PlatformCompanyModule),
      // // },
      // {
      //   path: 'beneficiary',
      //   loadChildren: (): Promise<BeneficiaryModule> =>
      //     import('./beneficiary/beneficiary.module').then((m) => m.BeneficiaryModule),
      // },
      // {
      //   path: 'client',
      //   loadChildren: (): Promise<ClientModule> => import('./client/client.module').then((m) => m.ClientModule),
      // },
      // {
      //   path: 'attached-file',
      //   loadChildren: (): Promise<AttachedFileModule> =>
      //     import('./attached-file/attached-file.module').then((m) => m.AttachedFileModule),
      // },
      // // {
      // //   path: 'user',
      // //   loadChildren: (): Promise<UserModule> => import('./user/user.module').then((m) => m.UserModule),
      // // },
      // {
      //   path: 'notification',
      //   loadChildren: (): Promise<NotificationModule> =>
      //     import('./notification/notification.module').then((m) => m.NotificationModule),
      // },
      // {
      //   path: 'parameter',
      //   loadChildren: (): Promise<ParameterModule> => import('./parameter/parameter.module').then((m) => m.ParameterModule),
      // },
      // {
      //   path: 'report',
      //   loadChildren: (): Promise<ReportModule> => import('./report/report.module').then((m) => m.ReportModule),
      // },
      // {
      //   path: 'swift-message',
      //   loadChildren: (): Promise<SwiftMessageModule> =>
      //     import('./swift-message/swift-message.module').then((m) => m.SwiftMessageModule),
      // },
      // {
      //   path: 'payer',
      //   loadChildren: (): Promise<PayerModule> =>
      //     import('./payer/payer.module').then((m) => m.PayerModule),
      // },
      {
        path: '',
        // // redirectTo: 'dashboard',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
