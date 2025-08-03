import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { MyAccountInfoComponent } from './my-account-info/my-account-info.component';
import { MyAccountComponent } from './my-account.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { MfaFormComponent } from './mfa-form/mfa-form.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    canActivate: [AuthenticationGuard],
    data: {
      roles: [RoleEnum.ROOT, RoleEnum.ADMINISTRADOR, RoleEnum.ESTUDIANTE],
    },
    children: [
      {
        path: 'my-account-info',
        component: MyAccountInfoComponent,
      },
      {
        path: 'change-password-form',
        component: ChangePasswordFormComponent,
      },
      {
        path: 'mfa-form',
        component: MfaFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAccountRoutingModule {}

export const routedComponents = [MyAccountComponent, MyAccountInfoComponent, ChangePasswordFormComponent, MfaFormComponent];
