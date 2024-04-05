import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-service-component',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './service-component.component.html',
  styleUrl: './service-component.component.scss'
})
export class ServiceComponentComponent {

}
