import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { SettingFormComponent } from './setting-form/setting-form.component';
import { SettingListComponent } from './setting-list/setting-list.component';
import { SettingComponent } from './setting.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
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
        component: SettingListComponent,
      },
      {
        path: 'create',
        component: SettingFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: SettingFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: SettingFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}

export const routedComponents = [SettingComponent, SettingListComponent, SettingFormComponent];
