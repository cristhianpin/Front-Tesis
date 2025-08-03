import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingComponent } from './booking.component';

const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
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
        component: BookingListComponent,
      },
      {
        path: 'create',
        component: BookingFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: BookingFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: BookingFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}

export const routedComponents = [BookingComponent, BookingFormComponent, BookingListComponent];
