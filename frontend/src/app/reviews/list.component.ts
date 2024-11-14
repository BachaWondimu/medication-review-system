import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Review } from '../medications/medications.type';
import { MatListModule } from '@angular/material/list'; 
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Auth/auth.service';
import { CustomDatePipe} from './date.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatListModule, CustomDatePipe],
  providers: [],
  template: `
    <div class="review-container">
      @for(rev of $reviews(); track rev){
      <mat-list>
        <!-- <mat-list-item> Review: {{ rev.review }} </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item> Rating: {{ rev.rating }} </mat-list-item>
        <mat-divider></mat-divider> -->
        <mat-list-item> By: {{ rev.by.fullname }} </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item> Date: {{ rev.date | date }} </mat-list-item>
        <mat-divider></mat-divider>
        @if(rev.by.user_id===auth_service.$state()._id){
        <mat-action-list>
          <button mat-button (click)="edit_review(rev._id)">Edit</button>
          <button mat-button (click)="delete_review(rev._id)">Delete</button>
        </mat-action-list>
        }
        <mat-divider></mat-divider>
        <mat-divider></mat-divider>
      </mat-list>
      }@empty {
      <mat-list>
        <mat-list-item>No reviews available</mat-list-item>
      </mat-list>
      }
    </div>
  `,
  styles: `
   .review-container {
        margin-top: 50px;
        min-width: 400px;
        background-color: #e5e5e3;
      }
      button{
        background-color: #4CAF50;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
      }
      `,
})
export class ListComponent {
  medication_id = input<string>('');
  $reviews = signal<Review[]>([]);
  readonly #http = inject(HttpClient);
  readonly #toastr = inject(ToastrService);
  readonly auth_service = inject(AuthService);
  readonly #router = inject(Router);

  constructor() {
    effect(() => {
      this.#http
        .get<{ success: boolean; data: Review[] }>(
          `http://localhost:3000/medications/${this.medication_id()}/reviews`
        )
        .subscribe((response) => {
          if (response.success) {
            this.$reviews.set(response.data);
            console.log(this.$reviews());
            this.#toastr.success(this.$reviews()?.[0].by.fullname);
          }
        });
    });
  }

  edit_review(review_id: string) {
    this.#router.navigate([
      'medications',
      'details',
      this.medication_id(),
      'reviews',
      'update-review',
      review_id,
    ]);
  }
 
  delete_review(_id: string) {
    this.#http
      .delete<{ success: boolean; data: string }>(
        `http://localhost:3000/medications/${this.medication_id()}/reviews/${_id}`
      )
      .subscribe(
        (response) => {
          this.$reviews.update((reviews) => {
            return reviews.filter((review) => review._id !== _id);
          });
          this.#toastr.success('Review deleted successfully');
        },
        (error) => {
          this.#toastr.error('Failed to delete review');
        }
      );
  }
}
