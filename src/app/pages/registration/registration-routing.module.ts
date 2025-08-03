import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { RegistrationComponent } from './registration.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    canActivate: [AuthenticationGuard],
    data: {
      roles: [RoleEnum.ROOT, RoleEnum.ADMINISTRADOR, RoleEnum.ESTUDIANTE],
    },
    children: [
      {
        path: '',
        redirectTo: 'view',
      },
      {
        path: 'view',
        component: RegistrationFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'list',
        component: RegistrationListComponent,
        data: { operation: 'C' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}

export const routedComponents = [RegistrationComponent, RegistrationFormComponent, RegistrationListComponent];
