import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
// Importez d'autres modules nécessaires ici

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
    // Ajoutez d'autres imports ici
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    // Ajoutez d'autres exports ici
  ]
})
export class SharedModule { }
