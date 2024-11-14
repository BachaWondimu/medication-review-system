import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {AddTokenInterceptor} from "./Auth/auth.interceptor";
import { AuthService } from './Auth/auth.service';
import { MedicationService } from './medications/medication.service';

const bootStrap = () => {
  const auth_service = inject(AuthService);
  const med_Service = inject(MedicationService)
  return () => {

    const auth_state = localStorage.getItem('auth_state');
    if(auth_state) {
    auth_service.$state.set(JSON.parse(auth_state));
    }
    const med_state = localStorage.getItem('medications');
    if(med_state) {
      med_Service.$medications.set(JSON.parse(med_state));
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
    provideToastr(),
    provideHttpClient(withInterceptors([AddTokenInterceptor])),
    { provide: APP_INITIALIZER, multi: true, useFactory:bootStrap},
  ],
};
