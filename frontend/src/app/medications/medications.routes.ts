import { Routes } from '@angular/router';
import { ListComponent } from './list.component';

export const medicationsRoutes: Routes = [
  { path: '', component: ListComponent, pathMatch: 'full' },
  {
    path: 'add',
    loadComponent: () => import('./add.component').then((c) => c.AddComponent),
    title: 'Add Medication',
  },
  {
    path: 'update/:medication_id',
    loadComponent: () =>
      import('./update.component').then((c) => c.UpdateComponent),
    title: 'Edit Medication',
  },
  {
    path: 'details/:_id',
    loadComponent: () =>
      import('./details.component').then((c) => c.DetailComponent),
    title: 'Medication Details',
  },
  {
    path: 'details/:medication_id/reviews',
    loadChildren: () =>
      import('../reviews/review.routes').then((r) => r.reviewsRoutes),
  },
  { path: '**', redirectTo: '' },
];
