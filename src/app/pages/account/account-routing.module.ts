import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { AccountComponent } from './account.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { CompanySearchModalComponent } from '../company/company-search-modal/company-search-modal.component';
import { PlatformCompanySearchModalComponent } from '../platform-company/platform-company-search-modal/platform-company-search-modal.component';
import { AccountImportModalComponent } from './account-import-modal/account-import-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
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
        component: AccountListComponent,
      },
      {
        path: 'create',
        component: AccountFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: AccountFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: AccountFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

export const routedComponents = [
  AccountComponent,
  AccountFormComponent,
  AccountListComponent,
  CompanySearchModalComponent,
  PlatformCompanySearchModalComponent,
  AccountImportModalComponent,
];
