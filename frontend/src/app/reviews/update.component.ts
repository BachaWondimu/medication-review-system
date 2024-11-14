import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatInputModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="updateReview()">
      <mat-form-field>
        <mat-label>review</mat-label>
        <input matInput formControlName="review" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Rating</mat-label>
        <input matInput formControlName="rating" />
      </mat-form-field>
      <button mat-raised-button type="submit" [disabled]="form.invalid">
        Submit
      </button>
    </form>
  `,
  styles: ``,
})
export class UpdateComponent {
  review_id = input<string>('');
  medication_id = input<string>('');

  readonly #router = inject(Router);
  readonly #toastr = inject(ToastrService);
  readonly #http = inject(HttpClient);

  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: ['', Validators.required],
  });

  constructor() {
    if (this.review_id() && this.medication_id() ){
      this.#http.get<{ "success": boolean, "data": boolean }>(`http://localhost:3000/medications/${this.medication_id()}/reviews/${this.review_id()}`)
        .subscribe((response) => {
          if (response.success) {
            this.form.patchValue({
              review: 'review',
              rating: 'rating',
            });
          }
        });
    }

  }

  updateReview() {
    this.#http.put<{ success: boolean; data: boolean }>(`http://localhost:3000/medications/${this.medication_id()}/reviews/${this.review_id()}`, this.form.value)
      .subscribe((response) => { 
        if (response.success) {
          this.#toastr.success('Review updated successfully');
          this.#router.navigate(['medications', 'details', this.medication_id(), 'reviews']);
        }
      });
  }
}
