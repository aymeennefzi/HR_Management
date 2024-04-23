import { AfterViewInit, Component, Inject, NgModule, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { ServiceComponentComponent } from './service-component/service-component.component';
import { JobsListService } from 'app/admin/jobs/jobs-list/jobs-list.service';
import { JobsList } from 'app/admin/jobs/jobs-list/jobs-list.model';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormdialogComponentComponent } from './formdialog-component/formdialog-component.component';
import { ChatService } from './chat.service';
import { HttpClient } from '@angular/common/http';

const routes: Routes = [
 
  { path: 'services', component:ServiceComponentComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirection par défaut vers /home
];
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,MatIconModule , ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements AfterViewInit , OnInit   {
  userInput: string = '';
  constructor(private chatS : ChatService , private fb: FormBuilder , private http: HttpClient) {
    
  }
  ngAfterViewInit(): void {
    const chatbox = document.querySelector('.chatbox__support');
    const openChatboxBtn = document.querySelector('.chatbox__button');
    if (chatbox && openChatboxBtn) {
      openChatboxBtn.addEventListener('click', () => {
          chatbox.classList.toggle('chatbox--active'); 
      });
    } else {
      console.error('Unable to find chatbox or openChatboxBtn elements.');
    }
  }
  ngOnInit(): void {
    this.messageForm = this.fb.group({
      newMessage: ['']
    });
  }
  messages: any[] = [];
  messageForm !: FormGroup; 

sendMessage() {
  const newMessageControl = this.messageForm?.get('newMessage');
  if (newMessageControl && newMessageControl.value?.trim()) {
    const userMessage = newMessageControl.value.trim();
    this.chatS.sendMessage(userMessage).subscribe(response => {
      // Ajouter le nouveau message envoyé par l'utilisateur
      this.messages.push({ text: userMessage, type: 'sent' });

      // Ajouter le message reçu du chatbot
      this.messages.push({ text: response.data.message, type: 'received' });

      // Réinitialiser le champ de saisie après l'envoi du message
      newMessageControl.reset();
    }, error => {
      console.error('Error:', error);
    });
  }
}
}