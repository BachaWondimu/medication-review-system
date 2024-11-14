import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const AddTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.is_logged_in()) {
    const req_with_token = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${authService.$state().jwt}`
      ),
    });
    return next(req_with_token);
  } else {
    return next(req);
  }
};
