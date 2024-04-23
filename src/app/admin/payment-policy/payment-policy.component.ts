import { Component, OnInit } from '@angular/core';
import { PaymentPolicy } from './PaymentPolicy.model';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../payment-policy/form-dialog/form-dialog.component';


@Component({
  selector: 'app-payment-policy',
  standalone: true,
  imports: [BreadcrumbComponent, 
            MatCardModule,
            CommonModule,
            MatIconModule ,
            MatButtonModule,
  ],
  templateUrl: './payment-policy.component.html',
  styleUrl: './payment-policy.component.scss'
})
export class PaymentPolicyComponent implements OnInit {

  paymentPolicies: PaymentPolicy[] = [];

  constructor(private http: HttpClient,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchPaymentPolicies();
  }

  fetchPaymentPolicies(): void {
    this.http.get<PaymentPolicy[]>('http://localhost:3000/payment-policy').subscribe(
      (data) => {
        this.paymentPolicies = data;
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des politiques de paiement : ', error);
      }
    );
  }


  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        action: 'ADD',
      },
    });
  }
  
  edit() {
    if (this.paymentPolicies && this.paymentPolicies.length > 0) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        data: {
          _id:this.paymentPolicies[0]._id,
          action: 'EDIT',
          policy: this.paymentPolicies[0] // Vous pouvez changer l'index ici si nécessaire
        },
      });
    } else {
      // Gérer le cas où paymentPolicies est vide
      console.error("No payment policies available for editing.");
    }
  }
  
  

  refresh() {
    // Implémentez la logique pour rafraîchir la liste

    this.fetchPaymentPolicies();

    console.log('Fonction refresh() appelée');
  }

  removeSelectedRows() {
    // Implémentez la logique pour supprimer les lignes sélectionnées
    console.log('Fonction removeSelectedRows() appelée');
  }

}
  
  


