// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { FormsModule, UntypedFormControl } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { NgScrollbar } from 'ngx-scrollbar';
// import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
// import { ActivatedRoute } from '@angular/router';
// import { Message } from './Models/message';
// import { Room } from './Models/room';
// import { IonicModule, NavController, ToastController } from '@ionic/angular';
// import { MessageService } from './Services/message.service';
// import { RoomService } from './Services/room.service';
// import { Subscription } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';
// import { NgxSocketServiceService } from './Services/ngx-socket-service.service';
// import { debounceFn } from 'debounce-decorator-ts';
// import { CommonModule } from '@angular/common';
// import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.scss'],
//   standalone: true,
//   imports: [  
//     BreadcrumbComponent,
//     NgScrollbar,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     FormsModule,
//     CommonModule,
//     FeatherIconsComponent,
//     IonicModule

//     ],
// })
// export class ChatComponent implements OnInit , OnDestroy {
//   private socket = inject(  NgxSocketServiceService);

//   hideRequiredControl = new UntypedFormControl(false);
//   typingSound: HTMLAudioElement = new Audio();
//   messages: Message[] = [];
//   nickname = '';
//   message = '';
//   room: Room = {};
//   subscription !: Subscription;
//   typingTimeout: any;

//   rooms!: Room[];

//   roomName!: string;
//   constructor(private route: ActivatedRoute,
//     //private socket: Socket,
//     private toastCtrl: ToastController,
//     private messagesService: MessageService,
//     private roomsService: RoomService,
//     private cookieService:CookieService,
//     private navController: NavController) {  
//       this.typingSound.src = './assets/sounds/typing.mp3'; 
//   }
//   ngOnInit(): void {
//     const cookieData = this.cookieService.get('user_data');
//     const userData = JSON.parse(cookieData);
//     const firstname = userData.user.firstname;
//     console.log('Connected to WebSocket server:', this.socket.ioSocket.connected);
//     this.subscription = this.route.params.subscribe(params => {
//       const roomId = params['roomId'];
//       this.socket.emit('enter-chat-room', {roomId, nickname: this.nickname});
//       this.roomsService.findById(roomId).subscribe(room => {
//         this.room = room;
//         this.messagesService.find({where: JSON.stringify({room: this.room._id})}).subscribe(messages => {
//           this.messages = messages;
//         });
//       });
//     });
//     this.socket.on('message', (message : any) => this.messages.push(message));
//     this.socket.on('users-changed', (data: any) => {
//       const user = data.user;
//       if (data.event === 'left') {
//         this.showToast('User left: ' + user);
//       } else {
//         this.showToast('User joined: ' + user);
//       }
//     });
//     this.socket.on('typing', (data : any) => {
//       console.log('Received typing event:', data);
//       if (data.isTyping) {
//         this.showToast(data.nickname + ' is typing...');
//         console.log("insidetyping");
//       }
//       console.log("outsidedetyping");
//     });
//     this.searchRoom(''); // <2>

//   }
//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//     this.socket.removeAllListeners('message');
//     this.socket.removeAllListeners('users-changed');
//     this.socket.emit('leave-chat-room', {roomId: this.room._id, nickname: this.nickname});
//   }
//   sendMessage() {
//     const test =this.socket.emit('add-message', {text: this.message, room: this.room._id});
//     console.log(test)
//     this.message = '';
//    // this.messagesService.playAudio();
//   }
//   async showToast(msg : any) {
//     const toast = await this.toastCtrl.create({
//       message: msg,
//       duration: 2000
//     });
//     toast.present();
//   }
//   startTyping() {
//     clearTimeout(this.typingTimeout);
//     this.socket.emit('typing', { roomId: this.room._id, nickname: this.nickname, isTyping: true });
//     this.typingSound.play();
//   }
//   stopTyping() {
//     clearTimeout(this.typingTimeout);
//     this.typingTimeout = setTimeout(() => {
//       this.socket.emit('typing', { roomId: this.room._id, nickname: this.nickname, isTyping: false });
//     }, 1000); // Ajustez la valeur de timeout au besoin
//   }
//   @debounceFn(500)
//   searchRoom(id: string | undefined) { // <3>
//     const params: any = {};
//     if (id) { params.id = id; }
//     const tesr111 =this.roomsService.find(params).subscribe(rooms => this.rooms = rooms);
//     console.log(tesr111)
//   }

//   selectedRoom: Room | null = null;

//   joinRoom(room: Room) { // <4>
//     this.selectedRoom = room;
//   }

//   addRoom() { // <5>
//     this.roomsService.save({name: this.roomName}).subscribe(room => {
//       this.roomName = '';
//       this.rooms.push(room);
//     });
//   }
// }

