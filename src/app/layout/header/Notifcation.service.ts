import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateNotificationsDto } from './createNotifications.dto';
import { IMessage } from './IMessage.interface';


@Injectable({
  providedIn: 'root'
})
export class NotifcationServiceService {

  private apiUrl = 'http://localhost:3000/notification';  // Adjust this URL to match your actual API endpoint

  constructor(private http: HttpClient) {}

  createNotification(dto: any): Observable<IMessage> {
    return this.http.post<IMessage>(`${this.apiUrl}`, dto);
  }

  getNotifications(): Observable<CreateNotificationsDto[]> {
    return this.http.get<CreateNotificationsDto[]>(`${this.apiUrl}`);
  }

  // SSE method to listen for new notifications
  notificationListener(): Observable<MessageEvent> {
    return new Observable(observer => {
      const eventSource = new EventSource(`${this.apiUrl}/listener`);
      eventSource.onmessage = event => {
        observer.next(event);
      };
      eventSource.onerror = error => {
        observer.error(error);
      };
      // Close the connection when the observer unsubscribes
      return () => eventSource.close();
    });
  }
  updateUnseenNotificationByIds(dto: { notifications_ids: string[] }): Observable<any> { // Utilisez le type de retour approprié
    return this.http.patch(`${this.apiUrl}`, dto);
  }
}
