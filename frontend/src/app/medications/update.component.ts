import { Component, effect, inject, input } from '@angular/core';
import { MedicationService } from './medication.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Medication } from './medications.type';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatButton],
  template: ` <form [formGroup]="form" (ngSubmit)="updateMedication()">
    <mat-form-field>
      <mat-label>Name</mat-label>
      <input matInput formControlName="name" />
    </mat-form-field>
    <mat-form-field>
      <mat-label>Generic_name</mat-label>
      <input matInput formControlName="generic_name" />
    </mat-form-field>
    <mat-form-field>
      <mat-label>Medication_class</mat-label>
      <input matInput formControlName="medication_class" />
    </mat-form-field>
    <mat-form-field>
      <mat-label>Availability</mat-label>
      <input matInput formControlName="availability" />
    </mat-form-field>
    <!-- <input formControlName="image" type="file" (change)="setFile($event)" /> -->
    <button mat-raised-button type="submit" [disabled]="form.invalid">
      Submit
    </button>
  </form>`,
  styles: `
  form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }`,
})
export class UpdateComponent {
  medication_id = input<string>('');

  #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly med_service = inject(MedicationService);
  readonly toastr = inject(ToastrService);

  form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: ['', Validators.required],
    // image: '',
  });

  constructor() {
    effect(() => {
      if (this.medication_id()) {
        this.med_service.getMedicationById(this.medication_id()).subscribe((response) => {
          if (response.success)
            this.form.patchValue(response.data);
        });
    }})
  }

  // file!: File;
  // setFile(event: Event) {
  //   this.file = (event.target as HTMLInputElement).files![0];
  //   this.toastr.success('File uploaded successfully');
  // }

  updateMedication() {
    this.#http.put<{ success: boolean; data: boolean }>(environment.BACKEND_URL + `/medications/${this.medication_id()}`, this.form.value as Medication).subscribe(response => { 
      if(response.data) {
        this.toastr.success('Medication updated successfully');
        this.#router.navigate(['/medications']);
      }
      else {
        this.toastr.error('Error updating medication');
      }
    });
  }
}
