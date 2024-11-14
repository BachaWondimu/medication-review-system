
import { Routes } from '@angular/router';
import { ListComponent } from './list.component';

export const reviewsRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    pathMatch: 'full',
  },
  {
    path: 'add-review',
    loadComponent: () =>
      import('./add.component').then((c) => c.AddReviewComponent),
  },
  {
    path: 'update-review/:review_id',
    loadComponent: () =>
      import('./update.component').then((c) => c.UpdateComponent),
  }
];
