import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import  {io} from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  readonly uri : string = "ws://localhost:3000";
  private messageSentSubject: Subject<string> = new Subject<string>();

  socket:any ;

  // constructor() {
  //   this.socket = io("http://localhost:3000" , 
  //   {
  //     withCredentials : true,
  //     // extraHeaders: { "my-custom-header": "abcd" },
  //     transports: ["websocket"]
  //   })
  //   this.socket.on("connect", () => {
  //     console.log("Connecté au serveur WebSocket");
  //   });
  //   this.socket.on("disconnect", () => {
  //     console.log("Déconnecté du serveur WebSocket");
  //   });
  // }
  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  // Méthode pour recevoir des messages du serveur
  receiveMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (data : any) => {
        observer.next(data);
      });
    });
  }
  
 
}
