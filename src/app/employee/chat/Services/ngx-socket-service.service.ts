import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

@Injectable({
  providedIn: 'root'
})
export class NgxSocketServiceService extends Socket {

  constructor() { 
    super(config);
    this.disconnect();
  }
}
