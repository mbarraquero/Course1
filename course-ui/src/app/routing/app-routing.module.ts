import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedInGuard } from './logged-in.guard';
import { loggedOutGuard } from './logged-out.guard';

const routes: Routes = [
  {
    path: 'members',
    canMatch: [loggedInGuard],
    loadChildren: () => import('../../view-members').then((m) => m.ViewMembersModule),
  },
  {
    path: 'lists',
    canMatch: [loggedInGuard],
    loadChildren: () => import('../../view-lists').then((m) => m.ViewListsModule),
  },
  {
    path: 'messages',
    canMatch: [loggedInGuard],
    loadChildren: () => import('../../view-messages').then((m) => m.ViewMessagesModule),
  },
  {
    path: '',
    canMatch: [loggedOutGuard],
    loadChildren: () => import('../../view-home-page').then((m) => m.ViewHomePageModule),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
