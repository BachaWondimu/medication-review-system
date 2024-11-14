import {Component, inject} from '@angular/core';
import {MedicationService} from './medication.service';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Medication} from "./medications.type";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatError,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="addMedication()">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
        @if(name.hasError('required')) {
        <mat-error>Name is required</mat-error>
        } @if(name.hasError('exists')) {
        <mat-error>Medication name already exists</mat-error>
        }
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
        @if(availability.hasError('required')) {
          <mat-error>Availability is required</mat-error>
        } @if(availability.hasError('pattern')) {
          <mat-error>Availability should be OTC or Prescription</mat-error>
        }
        <input matInput formControlName="availability" />
      </mat-form-field>
      <input formControlName="image" type="file" (change)="setFile($event)" />
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
export class AddComponent {
  #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly med_service = inject(MedicationService);
  readonly toastr = inject(ToastrService);

  form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required], this.check_name_exists.bind(this)],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: [
      '',
      [Validators.required, Validators.pattern(/OTC|Prescription/)],
    ],
    image: '',
  });

  file!: File;

  setFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    this.toastr.success('File uploaded successfully');
  }

  get name() {
    return this.form.controls.name;
  }
  get availability() {
    return this.form.controls.availability;
  }
  addMedication() {
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value as string);
    formData.append(
      'generic_name',
      this.form.get('generic_name')?.value as string
    );
    formData.append(
      'medication_class',
      this.form.get('medication_class')?.value as string
    );
    formData.append(
      'availability',
      this.form.get('availability')?.value as string
    );
    formData.append('medication_image', this.file);
    this.#http
      .post<{ success: boolean; data: Medication }>(
        `http://localhost:3000/medications`,
        formData
      )
      .subscribe((response) => {
        this.toastr.success('Medication added successfully');
        // console.log(response.data);
        this.form.reset();
        this.#router.navigate(['/medications']);
      });
  }

  check_name_exists(
    control: AbstractControl
  ): Observable<null | Record<string, boolean>> {
    return this.med_service.get_medications_by_name(this.name.value as string);
  }



}

