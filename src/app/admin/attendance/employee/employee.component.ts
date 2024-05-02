import { Component, Input, OnInit } from '@angular/core';
import { PieChartModule } from '@swimlane/ngx-charts';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CookieService } from 'ngx-cookie-service';
import { Calendar, EventInput } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { TodayService } from '../today/today.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LeavesService } from 'app/admin/leaves/leave-requests/leaves.service';
import { Leaves } from 'app/admin/leaves/leave-requests/leaves.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FeatherIconsComponent,
    PieChartModule,
    FullCalendarModule,
    DragDropModule,

  ],
})
export class EmployeeComponent implements OnInit {
  events!: any[];
  holidays!: any[];
  
  @Input() event!: EventInput;
  combinedEvents !: any ;
  options: any;
  theCheckbox: boolean = false;
  calendar!: Calendar;

  constructor(private todayService : TodayService , private leaveS : LeavesService, private cookieService : CookieService) {

    this.events =[];
    this.holidays =[];
    this.options = {
      plugins: [interactionPlugin, resourceTimelinePlugin  ],
      editable: true,
    
      weekends: true,
      themeSystem: 'bootstrap5',
      initialView: 'resourceTimeline',
      droppable: true,
      handleWindowResize: true ,
      slotLabelFormat: [
        { weekday: 'short' },
        { day: 'numeric'}
      ],
      visibleRange: (currentDate: Date) => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        return {
          start: startOfMonth,
          end: endOfMonth
        };
      },
      slotMinWidth: 60,
      height: 'auto',
      resourceAreaWidth: '14%' ,
      resourceAreaColumns: [
        {headerContent: 'Employees names' }
      ],
      eventClick: this.onEventClick.bind(this)
    };

  }
 
  ngOnInit() {
    this.todayService.getAllUserswithconge().subscribe(
      (usersWithConge: any[]) => {
        this.options = {
          ...this.options,
          resources: this.generateResourceList(usersWithConge)
        };
        const eventsFromConges = this.processCongesData(usersWithConge);
        this.events = [...this.events, ...eventsFromConges];
        this.options = { ...this.options, events: this.events };
        //console.log('aeozjzozjae' , usersWithConge)
      },
      
      
      error => {
        console.error('Erreur lors de la récupération des utilisateurs avec congé :', error);
      }
    );

  }
  
  generateResourceList(usersWithConge: any[]): any[] {
    return usersWithConge.map(user => ({
      id: user.id,
      title: user.name
    }));
  }
  
  processCongesData(usersWithConge: any[]): any[] {
    const events: any[] = [];
    usersWithConge.forEach(user => {
      user.leaves.forEach((conge: Leaves) => {
        const startDate = new Date(conge.startDate);
        const endDate = new Date(conge.endDate);
        const event = {
          resourceId: user.id,
          title: `${conge.leaveType}`, 
          start: startDate,
          end: endDate,
          backgroundColor: conge.status === 'Pending' ? 'blue' : (conge.status === 'Declined' ? 'red' : 'green'),
          description: `Type de congé : ${conge.leaveType}, Statut : ${conge.status} , idUser: ${conge._id}`
        };
       // console.log('testttt0 ' , event)
        events.push(event);
      });
    });
    return events;
  }
  onEventClick(eventInfo: any) {
    const event = eventInfo.event;
    const description = event.extendedProps.description; 
    const idUserMatch = description.match(/idUser: (\w+)/); 
    if (idUserMatch) {
        const userId = idUserMatch[1]; 
        Swal.fire({
            title: 'Approuver ou refuser cet événement ?',
            showCancelButton: true,
            confirmButtonText: 'Approuver',
            cancelButtonText: 'Refuser',
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCloseButton: true,
            timer: 10000, 
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.leaveS.accepterDemandeConge(userId).subscribe(() => {
                    event.setProp('backgroundColor', 'green');
                    eventInfo.view.calendar.refetchEvents();

                    Swal.fire('Succès', 'L\'événement a été approuvé avec succès !', 'success');
                    
                }, error => {
                    console.error('Erreur lors de l\'approbation de l\'événement :', error);
                    Swal.fire('Erreur', 'Une erreur s\'est produite lors de l\'approbation de l\'événement.', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.leaveS.refuserDemandeConge(userId).subscribe(() => {
                    event.setProp('backgroundColor', 'red');
                    eventInfo.view.calendar.refetchEvents();

                    Swal.fire('Succès', 'L\'événement a été refusé avec succès !', 'success');
                }, error => {
                    console.error('Erreur lors du refus de l\'événement :', error);
                    Swal.fire('Erreur', 'Une erreur s\'est produite lors du refus de l\'événement.', 'error');
                });
            }
        });

    } else {
        console.error('ID de l\'utilisateur non trouvé dans la description.');
    }
}
}