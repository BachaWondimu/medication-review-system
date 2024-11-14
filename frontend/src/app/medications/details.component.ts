import { ChangeDetectionStrategy, Component, InputSignal, effect, inject, input, signal } from '@angular/core';
import { MedicationService } from './medication.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Medication } from './medications.type';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule,NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="details-container">
      <mat-card class="example-card" appearance="outlined">
        <!-- <img
          [src]="'http://localhost:3000/images/' + medication().image.filename"
          alt="Photo of Medication"
          style="width: 100%;"
        /> -->

        <mat-card-content>
          <mat-list-item>
            Medication Name: {{ medication().name }}
          </mat-list-item>
          <mat-divider></mat-divider>
          <mat-list-item>
            Generic Name: {{ medication().generic_name }}
          </mat-list-item>
          <mat-divider></mat-divider>
          <mat-list-item>
            Medication Class: {{ medication().medication_class }}
          </mat-list-item>
          <mat-divider></mat-divider>
          <mat-list-item>
            Availability: {{ medication().availability }}
          </mat-list-item>
          <mat-divider></mat-divider>
          <mat-list-item>
            Added By: {{ medication().added_by.fullname }}
          </mat-list-item>
          <mat-divider></mat-divider>
          <mat-list-item>
            Reviews: {{ medication().reviews.length }}
          </mat-list-item>
          <mat-divider></mat-divider>
        </mat-card-content>
        <mat-card-actions>
          @if(is_authorized()){
          <button (click)="edit_handler(_id())" mat-edit-button>EDIT</button>
          <button (click)="delete_handler(_id())" mat-delete-button>DELETE</button>
          } @if(auth_service.is_logged_in()){
          <button (click)="medication_review(_id())" mat-review-button>REVIEW</button>
          <button (click)="add_review(_id())"mat-add-button>ADD-REVIEW</button>
          }
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .details-container {
      border: 1px solid #e6e61b;
      margin-top: 50px;
      display: grid;
      max-width: 960px;
    }
     button{
        background-color: #f8bb9f;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
      }
  `,
})
export class DetailComponent {
  _id = input<string>('');
  readonly #router = inject(Router);
  readonly #toastr = inject(ToastrService);
  readonly med_service = inject(MedicationService);
  readonly auth_service = inject(AuthService);
  medication = signal<Medication>({
    _id: '',
    name: '',
    first_letter: '',
    generic_name: '',
    medication_class: '',
    availability: '',
    image: { filename: '', originalname: '' },
    added_by: {
      user_id: '',
      fullname: '',
      email: '',
    },
    reviews: [],
  });

  constructor() {
    console.log('Inside details constructor', this._id());
    effect(() => {
      if (this._id()) {
        console.log('Inside details constructor effect', this._id());
        this.med_service.getMedicationById(this._id()).subscribe((response) => {
          this.medication.set(response.data);
          console.log(
            'Inside details constructor after request',
            this.medication
          );
        });
      }
    });
  }

  is_authorized() {
    return (
      this.auth_service.$state()._id &&
      this.medication().added_by.user_id === this.auth_service.$state()._id
    );
  }
  delete_handler(medication_id: string) {
    this.med_service.deleteMedication(medication_id).subscribe((response) => {
      if (response.success) {
        this.#toastr.success('Medication deleted successfully');
        this.#router.navigate(['', 'medications']);
      } else {
        this.#toastr.error('Error deleting medication');
      }
    });
  }
  edit_handler(medication_id: string) {
    this.#router.navigate(['', 'medications', 'update', medication_id]);
  }


  medication_review(medication_id: string) {
    console.log('Medication Review', medication_id);
    this.#router.navigate(['medications', 'details', medication_id, 'reviews']);
  }
  add_review(medication_id: string) {
    console.log('Add Review', medication_id);
    this.#router.navigate(['medications', 'details', medication_id, 'reviews', 'add-review']);
  }

}
