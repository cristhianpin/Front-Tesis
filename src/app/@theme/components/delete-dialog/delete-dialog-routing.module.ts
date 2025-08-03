import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeleteDialogComponent } from './delete-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: DeleteDialogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteDialogRoutingModule {}

export const routedComponents = [DeleteDialogComponent];
