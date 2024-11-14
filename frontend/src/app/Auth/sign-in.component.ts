import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, State } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="sign_in()">
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" />
      </mat-form-field>
      <button mat-raised-button type="submit" [disabled]="form.invalid">
        Submit
      </button>
    </form>
  `,
  styles: `
  form{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}`,
})
export class SignInComponent {
  form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly #authService = inject(AuthService);
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  sign_in() {
    this.#authService
      .signIn(this.form.value as { email: string; password: string })
      .subscribe({
        next: response => {
          if (response.success) {
            const decoded_token = jwtDecode(response.data) as State;
            this.#authService.$state.set({
              _id: decoded_token._id,
              fullname: decoded_token.fullname,
              email: decoded_token.email,
              password: '',
              jwt: response.data,
            });
            localStorage.setItem("auth_state", JSON.stringify(this.#authService.$state()))
            this.#toastr.success('User signed in successfully');
            this.#router.navigate(['/medications']);
          }
        },
        error: error => {
          this.#toastr.error('wrong email or password')
        }
      });
  }
}
