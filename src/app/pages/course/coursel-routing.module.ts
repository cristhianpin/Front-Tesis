import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../../@core/shared/guard/authentication.guard';
import { RoleEnum } from '../../@core/shared/enum/role.enum';
import { CourseComponent } from './course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { PlanFormComponent } from './plan-form/plan-form.component';

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
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
        component: CourseListComponent,
      },
      {
        path: 'create',
        component: CourseFormComponent,
        data: { operation: 'C' },
      },
      {
        path: 'view/:objId',
        component: CourseFormComponent,
        data: { operation: 'R' },
      },
      {
        path: 'edit/:objId',
        component: CourseFormComponent,
        data: { operation: 'U' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourselRoutingModule {}

export const routedComponents = [PlanFormComponent, CourseComponent, CourseListComponent, CourseFormComponent];
