import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Medication } from './medications.type';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  readonly http = inject(HttpClient);

  $medications = signal<Medication[]>([]);

  constructor() {
    effect(() => {
      localStorage.setItem('medications', JSON.stringify(this.$medications()));
    });
  }

  getMedications(char: string) {
    return this.http.get<{ success: boolean; data: Medication[] }>(
      environment.BACKEND_URL + '/medications' + `?first_letter=${char}`
    );
  }
  addMedication(medication: FormData) {
    return this.http.post<{ success: boolean; data: Medication }>(
      environment.BACKEND_URL + '/medications',
      medication
    );
  }
  getMedicationById(medication_id: string) {
    return this.http.get<{ success: boolean; data: Medication }>(
      environment.BACKEND_URL + `/medications/${medication_id}`
    );
  }
  getMedicationByIdFromState(medication_id: string | undefined) {
    return this.$medications().find((med) => med._id === medication_id);
  }

  updateMedication(medication: Medication) {
    return this.http.put<{ success: boolean; data: boolean }>(
      environment.BACKEND_URL + `/medications/${medication._id}`,
      medication
    );
  }

  deleteMedication(medication_id: string) {
    return this.http.delete<{ success: boolean; data: boolean }>(
      environment.BACKEND_URL + `/medications/${medication_id}`
    );
  }

  get_medications_by_name(name: string) {
    return this.http.get<null|{exists:boolean}>(environment.BACKEND_URL + '/medications/by-name'+`?name=${name}`);
  };
}
