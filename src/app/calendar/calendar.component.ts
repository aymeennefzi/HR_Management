import {  AfterViewInit, Component, Input, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { MatDialogModule } from '@angular/material/dialog';

import {
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import {    FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { CdkDragDrop, DragDropModule  } from '@angular/cdk/drag-drop';
import { CalendarService } from './calendar.service';
import { FormsModule } from '@angular/forms';
import { AttendancesService } from 'app/employee/attendance/attendance.service';
import { CookieService } from 'ngx-cookie-service';
import { Calendar, Holidayss } from './calendar.model';
import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatCheckboxModule,
    FullCalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule,
    DragDropModule,
    FormsModule ,
    CommonModule
  ],
})
  export class CalendarComponent extends UnsubscribeOnDestroyAdapter implements OnInit{
  events!: any[];
  holidays!: any[];
  
  @Input() event!: EventInput;
  holidayss!: Holidayss[];
  combinedEvents !: any ;
  options: any;
  theCheckbox: boolean = false;
  constructor(private scheduleService: AttendancesService , private calanderS : CalendarService , private cookieService : CookieService) {
    super();
    this.events =[];
    this.holidays =[];
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridFourDay '
      },
      // ,dayGridMonth,timeGridWeek,timeGridDay
      editable: true,
      weekends: true,
      themeSystem: 'bootstrap5',
      initialView: 'timeGridFourDay',
      googleCalendarApiKey: 'AIzaSyAI8Ron1vfcPASOXCYvS_BHqpW_n683ulY',
      events: {
        googleCalendarId: 'aymen.nefzi@esprit.tn',
      },
      views: {
        timeGridFourDay: {
          type: 'dayGrid',
          duration: { days: 7 },
          buttonText: '7 day'
        }
      },
      contentHeight: 200,
      drop: this.handleDrop.bind(this),
      
      droppable: true,
      eventDidMount: function(info: any) {
        const extendedProps = info.event.extendedProps;
        if (extendedProps && extendedProps.etat) {
          const etat = extendedProps.etat;
          let color;

          switch (etat) {
            case 'Approved':
              color = 'green';
              break;
              case 'Declined':
              color = 'red';
              break;           
              case 'Pending':
              color = 'blue';
              break;
            default:
              color = ''; 
          }
          if (color) {
            info.el.style.backgroundColor = color;
          }
        }
      },
      dayCellDidMount: (dayRenderInfo: any) => {
        const dateMoment = moment(dayRenderInfo.date);
        if (dateMoment.day() === 6 || dateMoment.day() === 0) {
          dayRenderInfo.el.style.backgroundColor = '#d6e7e1';
        } else {
          dayRenderInfo.el.style.backgroundColor = 'white';
        } 
        return dayRenderInfo;
      }, 
    };        
    };
      ngOnInit() {
      this.setupDraggableEvents();
      this.loadEventsAndHolidays(); 
      
    }   
    setupDraggableEvents(): number {
      const draggableEl = document.getElementById('external-events');
      let eventValueCount = 0; // Initialiser le compteur à zéro
    
      if (draggableEl) {
        new Draggable(draggableEl, {
          itemSelector: '.fc-event',
          eventData: (eventEl: HTMLElement) => {
            const eventValue = eventEl.querySelector('.fc-event-main')?.textContent;
                if (eventValue) {
              eventValueCount++;
            }
            return {
              title: eventValue
            };
          }
        });
      }
      return eventValueCount;
    }

    loadEventsAndHolidays(): void {
      const cookieData = this.cookieService.get('user_data');
      const userData = JSON.parse(cookieData);
      const userId = userData.user.id;
      // Charger les événements des utilisateurs
      const test = this.calanderS.getAttendancesForUser(userId).subscribe((userData: Calendar[]) => {
        this.calanderS.getAllHolidays().subscribe((holidayData: Holidayss[]) => {
          this.combinedEvents = [...this.mapUserEvents(userData), ...this.mapHolidayEvents(holidayData)];
          this.updateCalendarOptions(this.combinedEvents);
        });
      });
    }
    customDayCellDidMount(dayRenderInfo: any): void {
        const date = dayRenderInfo.date;
        const isHoliday = this.holidays.some(event => moment(event.date).isSame(date, 'day') && event.backgroundColor === 'red')
        console.log(isHoliday);
      // Colorer en rouge les jours fériés
      if (isHoliday) {
        dayRenderInfo.el.style.backgroundColor = 'red';
      } else {
        // Appliquer la logique de coloration pour les autres jours
        const dateMoment = moment(dayRenderInfo.date);
        if (dateMoment.day() === 6 || dateMoment.day() === 0) {
          dayRenderInfo.el.style.backgroundColor = '#d6e7e1'; // Week-ends
        } else {
          dayRenderInfo.el.style.backgroundColor = 'white'; // Autres jours de la semaine
        }
      }
    }  

    mapUserEvents(userData: Calendar[]): any[] {
      console.log(userData); 
      return userData.map(item => ({
        title: item.status ,// Ajuster le titre en fonction de l'état
        date: item.date  , // Inclure la date pour chaque événement
        extendedProps: { etat: item.etat || '' },
        editable: item.etat !== 'Approved' && item.etat !== 'Declined' // Rendre draggable seulement si l'état n'est pas "Approved" ou "Declined"
      }));
    }
    // Sélectionnez tous les éléments avec la classe "fc-event-time"
    


    mapHolidayEvents(holidayData: Holidayss[]): any[] {
      return holidayData.map(item => ({
        title: item.name,
        start: item.datee, 
        allDay: true, 
        backgroundColor: 'red',
        display: 'background' 
      }));
    }
    // Mettre à jour les options du calendrier avec la liste combinée d'événements
    updateCalendarOptions(combinedEvents: any[]): void {
      this.events = combinedEvents;
      this.options = { ...this.options, events: this.events };
    }
    
    handleDrop(eventDropInfo: any): void {
      const date = eventDropInfo.dateStr;
      const cardValue = eventDropInfo.draggedEl.querySelector('.fc-event-main')?.textContent;
      Swal.fire({
        title: 'Confirmer',
        text: 'Voulez-vous vraiment remettre cette carte dans le calendrier?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          // Si l'utilisateur confirme, mettre à jour les données dans le calendrier
          const calendarData: Calendar = {
            date: date,
            status: cardValue || '' // Utiliser une chaîne vide si la valeur est nulle
          };
          const cookieData = this.cookieService.get('user_data');
          const userData = JSON.parse(cookieData);
          const userId = userData.user.id;
          this.calanderS.updateAttendanceList(userId, [calendarData]).subscribe(
            () => {
              this.ngOnInit();
            },
            error => {
            }
          );
        } else {
        }
      });
    }
  }  
