import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, State } from './auth.service';
import { User } from './user.type';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="signup()">
      <mat-form-field>
        <mat-label>Full Name</mat-label>
        <input matInput formControlName="fullname" />
      </mat-form-field>
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
    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }`,
})
export class SignupComponent {
  readonly authService = inject(AuthService);
  readonly toastr = inject(ToastrService);
  readonly #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  signup() {
    this.authService.signUp(this.form.value as User).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('User signed up successfully');
          this.authService
            .signIn(this.form.value as { email: string; password: string })
            .subscribe({
              next: (response) => {
                if (response.success) {
                  const decoded_token = jwtDecode(response.data) as State;
                    this.authService.$state.set({
                      _id: decoded_token._id,
                      fullname: decoded_token.fullname,
                      email: decoded_token.email,
                      password: '',
                      jwt: response.data,
                    });
                  this.#router.navigate(['/medications']);
                  this.toastr.success('User signed in successfully');
                }
              },
              error: (error) => {
                this.toastr.error('Wrong email or password');
              },
            });
        }
      },
      error: (error) => {
        this.toastr.error('User already exists');
      },
    });
  }
}
