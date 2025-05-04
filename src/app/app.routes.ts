import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/portal/portal/portal.component').then(m => m.PortalComponent),
    pathMatch: 'full',
  }
];
