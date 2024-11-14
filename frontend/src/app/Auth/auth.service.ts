import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { User, User_Details } from './user.type';
import { environment } from '../../environments/environment.development';
import {Router} from "@angular/router";

export interface State {
  jwt?: string;
  _id?: string;
  fullname?: string;
  email: string;
  password: string;
 }

export const initialState: State = {
  _id: '',
  fullname: 'Guest',
  email: '',
  password: '',
  jwt: '',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $state = signal<State>(initialState);
  readonly http = inject(HttpClient);
  readonly #router = inject(Router)
  constructor() {
    effect(() => {
      localStorage.setItem('auth_state', JSON.stringify(this.$state()));
    });
  }

  signUp(user_details: User) {
    return this.http.post<{ success: boolean; data: User }>(
      environment.BACKEND_URL + '/users/signup',
      user_details
    );
  }
  signIn(credentials: { email: string; password: string }) {
    return this.http.post<{ "success": boolean, "data": string }>(environment.BACKEND_URL+'/users/signin', credentials);
  }

  signOut() {
    this.$state.set(initialState);
    this.#router.navigate(['medications']);
  }
  is_logged_in() {
    return this.$state().jwt !== '';
  }
}
