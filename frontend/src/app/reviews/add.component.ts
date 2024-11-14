import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterLink,MatIcon],
  template: `
  <span mat-flat-button [routerLink]="['medications', 'details',medication_id(), 'reviews']">
    <mat-icon>arrow_left</mat-icon> Back
</span>
    <form [formGroup]="form" (ngSubmit)="addReview()">
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
export class AddReviewComponent {
goBack() {
throw new Error('Method not implemented.');
}
  medication_id = input<string>('');
  readonly #http = inject(HttpClient);
  
  readonly #toastr = inject(ToastrService);
  readonly #router = inject(Router);

  // { "review": string, "rating": string }

  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: ['', Validators.required],
  });

  get review() {
    return this.form.get('review');
  }
  get rating() {
    return this.form.get('rating');
  }


  addReview() {
   const formData = new FormData();
    formData.append('review', this.review?.value as string);
    formData.append('rating', this.rating?.value as string);

    console.log(formData.get('review'));
    
    this.#http.post<{ success: boolean, data: string }>(`http://localhost:3000/medications/${this.medication_id()}/reviews`,
      formData).subscribe(
        (response) => {
          console.log(response.data);
          this.#toastr.success('Review added successfully');
          this.form.reset();
          
      },
      (error) => {
        this.#toastr.error('Failed to add review');
      }
    );
  }
}