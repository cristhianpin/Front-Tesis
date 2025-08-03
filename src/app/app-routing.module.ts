import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: (): any => import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'pages',
    loadChildren: (): any => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'delete-dialog',
    loadChildren: (): any => import('./@theme/components/delete-dialog/delete-dialog.module').then((m) => m.DeleteDialogModule),
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
  enableTracing: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
