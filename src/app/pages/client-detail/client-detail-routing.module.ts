import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { ClientDetailComponent } from './client-detail.component';
import { ClientDetailListComponent } from './client-detail-list/client-detail-list.component';
import { RestoreDialogComponent } from './restore/restore-dialog.component';


const routes: Routes = [
  {
    path: '',
    component: ClientDetailComponent,
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
        component: ClientDetailListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDetailRoutingModule {}

export const routedComponents = [ClientDetailComponent, ClientDetailListComponent, RestoreDialogComponent];
