import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
  standalone: true,
  imports: [BreadcrumbComponent,
  CommonModule,
  QRCodeModule],
})
export class PayslipComponent {
  payslipData: any;
  @ViewChild('content') content!: ElementRef;

  constructor(private route: ActivatedRoute, private http: HttpClient,private cookieService:CookieService) { }
  authToken!: string;
  userId: string=this.retrieveUserName() ;
  private apiKey = 'QdL_M_q5VGXRj2fY8Er9';
  private apiUrl = 'https://docraptor.com/docs';
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const payrollId = params.get('id');
      if (payrollId) {
        this.getPayslipData(payrollId);
      }
    });
  }
  
  generatePDF(htmlContent: string) {
    return this.http.post(this.apiUrl, {
      document_content: htmlContent,
      // Autres options de mise en page ou de configuration
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(this.apiKey + ':')}`
      },
      responseType: 'blob' // Pour recevoir une réponse de type Blob
    });
  }

  downloadPDF() {
    const content = this.content.nativeElement.innerHTML;
    this.generatePDF(content).subscribe(
      (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      },
      (error) => {
        console.error('Erreur lors de la génération du PDF:', error);
      }
    );
  }

private retrieveUserName(): string {
  const cookieData = this.cookieService.get('user_data');
  let userName: string = ''; 
  if (cookieData) {
    const userData = JSON.parse(cookieData);
    const { firstname, lastname } = userData.user; 
    userName = `${firstname} ${lastname}`;
  }

  return userName; 
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

  if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return units[hundred] + ' Cent ' + (remainder !== 0 ? 'et ' + this.convertToWords(remainder) : '');
  }

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
  return '';
}
}
