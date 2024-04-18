import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedInGuard } from './logged-in.guard';
import { loggedOutGuard } from './logged-out.guard';

const routes: Routes = [
  {
    path: 'lists',
    canMatch: [loggedInGuard],
    loadChildren: () => import('../../view-lists').then((m) => m.ViewListsModule),
  },
  {
    path: 'home',
    canMatch: [loggedOutGuard],
    loadChildren: () => import('../../view-home-page').then((m) => m.ViewHomePageModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
