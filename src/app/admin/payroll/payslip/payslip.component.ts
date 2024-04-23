import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
  standalone: true,
  imports: [BreadcrumbComponent,
  CommonModule],
})
export class PayslipComponent {
  payslipData: any;
  @ViewChild('content', { static: false }) content!: ElementRef;
  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const payrollId = params.get('id');
      if (payrollId) {
        this.getPayslipData(payrollId);
      }
    });
  }
 downloadAsPDF() {
    const doc = new jsPDF();
    const content = this.content.nativeElement;
    html2canvas(content).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      const imgWidth = 210; 
      const imgHeight = canvas.height * imgWidth / canvas.width;
      doc.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('bulletin_de_salaire.pdf');
    });
  }
  getPayslipData(payrollId: string) {
    this.http.get<any>('http://localhost:3000/payroll/getPayrollWithPayP/' + payrollId)
      .subscribe(
        (response) => {
          this.payslipData = response;
        },
        (error) => {
          console.error('Error fetching payslip data:', error);
        }
      );
  }
  getMonthName(monthNumber: number): string {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return months[monthNumber - 1] || '';
}
convertToWords(num: number): string {
  const units = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
  const teens = ['Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf'];
  const tens = ['', 'Dix', 'Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante-dix', 'Quatre-vingt', 'Quatre-vingt-dix'];
  const numStr = num.toString();
  if (num === 0) {
      return 'Zéro';
  }
  if (num < 0) {
      return 'Moins ' + this.convertToWords(-num);
  }
  if (num < 100) {
      if (num < 10) {
          return units[num];
      } else if (num < 20) {
          return teens[num - 10];
      } else {
          const unit = num % 10;
          const ten = Math.floor(num / 10);
          return tens[ten] + (unit !== 0 ? '-' + units[unit] : '');
      }
  }
  // Gestion des centaines et des milliers
  if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return units[hundred] + ' Cent ' + (remainder !== 0 ? 'et ' + this.convertToWords(remainder) : '');
  }
  // Gestion des milliers et des millions
  if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return this.convertToWords(thousand) + ' Mille ' + (remainder !== 0 ? 'et ' + this.convertToWords(remainder) : '');
  }
  if (num < 1000000000) {
      const million = Math.floor(num / 1000000);
      const remainder = num % 1000000;
      return this.convertToWords(million) + ' Million ' + (remainder !== 0 ? 'et ' + this.convertToWords(remainder) : '');
  }
  // Gestion des nombres supérieurs à un milliard (à étendre selon vos besoins)
  return '';
}
}
