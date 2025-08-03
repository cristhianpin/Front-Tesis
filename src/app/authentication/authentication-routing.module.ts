import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { RequestPaswordComponent } from './request-password/request-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'sign-in',
        component: LoginComponent,
      },
      {
        path: 'sign-out',
        component: LogoutComponent,
      },
      {
        path: 'confirm-account/:us/:tk',
        component: ConfirmComponent,
      },
      {
        path: 'reset-password/:us/:tk',
        component: ChangePasswordComponent,
      },
      {
        path: 'request-password',
        component: RequestPaswordComponent,
      },
      {
        path: 'sign-up',
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
