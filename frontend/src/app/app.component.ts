import { Component, inject } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ChangeDetectionStrategy } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './Auth/sign-in.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Add this import
import { AuthService } from './Auth/auth.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatChipsModule,
    CommonModule,
    SignInComponent,
    MatIconModule,
    MatButtonModule,
    // MatProgressSpinnerModule,
    RouterLink,
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-container">
      @if(!auth_service.is_logged_in()){
      <button
        mat-flat-button
        [routerLink]="['signin']"
        routerLinkActive="router-link-active"
      >
        <mat-icon>login</mat-icon> login
      </button>
      <div class="sign-up">
        Don't have an account? <a [routerLink]="['signup']">Sign up</a>
      </div>
      }@else {
      <button mat-flat-button (click)="auth_service.signOut()">
        <mat-icon>logout</mat-icon> logout
      </button>
      }
    </div>

    <div class="outlet">
      <h2 [ngStyle]="{ 'margin-top': '150px' }">
        Welcome {{ auth_service.$state().fullname }}!
    </h2>
      <router-outlet />
    </div>
  `,
  styles: [
    `
      .auth-container {
        position: absolute;
        top: 0;
        right: 0;
        margin: 110px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .auth-container button {
        margin-bottom: 10px;
        color: red;
      }
      .outlet {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      h2 {
        color: red;
      }
      .sign-up {
        margin-top: 20px;
        font-size: 14px;
      }
    `,
  ],
})
export class AppComponent {
  readonly auth_service = inject(AuthService);
  readonly #toastr = inject(ToastrService);
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');



  // isLoading() {
  //   return this.auth_service.is_loading();
  // }


}
