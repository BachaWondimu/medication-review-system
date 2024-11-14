import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/medications', pathMatch: 'full' },

  {
    path: 'signup',
    loadComponent: () =>
      import('./Auth/signup.component').then((m) => m.SignupComponent),
    title: 'Sign Up',
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./Auth/sign-in.component').then((m) => m.SignInComponent),
    title: 'Sign In',
  },
  {
    path: 'medications',
    loadChildren: () =>
      import('./medications/medications.routes').then(
        (m) => m.medicationsRoutes
      ),
    title: 'Medications',
  },
];
