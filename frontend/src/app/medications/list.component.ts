import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MedicationService } from './medication.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Medication } from './medications.type';
import {MatAnchor} from "@angular/material/button";
import {AuthService} from "../Auth/auth.service";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatChipsModule,
    MatListModule,
    MatIcon,
    RouterLink,
    MatAnchor,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="alphabet-container">
      <mat-chip-set>
        <ng-template ngFor let-letter let-i="index" [ngForOf]="letters">
          <mat-chip (click)="getChar($event)">{{ letter }}</mat-chip>
        </ng-template>
      </mat-chip-set>
    </div>
    <div class="medication-container">
      <h3 [ngStyle]="{ color: 'green' }">
        Medication - {{ $char() }}
        <a mat-flat-button [routerLink]="['add']" [disabled]="!authService.is_logged_in()"> Add Medication</a>
      </h3>
      @for(med of medicationsService.$medications(); track med){
      <mat-list>
          <a [routerLink]="['details', med._id]">{{ med.name }}</a>
          <mat-divider></mat-divider>
      </mat-list>
      }
    </div>
  `,
  styles: [
    `
      .alphabet-container {
        display: grid;
        max-width: 960px;
      }
      mat-chip {
        height: 40px;
        width: 70px;
      }
      .medication-container {
        margin-top: 50px;
        background-color: #e5e5e3;
      }
      h3{
       border-style: solid;
       margin-top: 10px;
       margin-bottom: 10px;
      }
    `,
  ],
})
export class ListComponent {
  $char = signal<string>('A');
  authService = inject(AuthService)
  medicationsService = inject(MedicationService);
  medArray: Medication[] = [];

  constructor() {
    effect(() => {
      this.medArray = [];
      this.medicationsService
        .getMedications(this.$char())
        .subscribe((response) => {
          this.medicationsService.$medications.set(response.data);
          for (let med of response.data) {
            this.medicationsService
              .getMedicationById(med._id)
              .subscribe((response) => {
                if (response.success) {
                  this.medArray.push(response.data);
                }
              });
          }
          if (this.medArray.length > 0) {
            this.medicationsService.$medications.set(this.medArray);
          }
        });
    });
  }

  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  getChar(event: any) {
    const char = event.target.innerText;
    console.log(char);
    this.$char.set(char);
  }
}
