import { Calendar } from 'app/calendar/calendar.model';
import { Role } from './role';
import { Message } from 'app/employee/chat/Models/message';
import { Room } from 'app/employee/chat/Models/room';

export class User {
  _id!: string;
  img!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  etablissement!: string;
  EmailSecondaire!: string;
  TelSecondaire!: string;
  dateEntree!: string;
  Tel!: string;
  Matricule!: string;
  password!: string;
  roleName!: Role;
  role!:string[]//me permet de fetcher seulement les user de role employe(ahmed)
  soldeConges !: number; 
  soldeMaladie !: number ;
  fonction !: string ;
  token !: string ;
  profileImage ?:string ;
  attendances!: Calendar[] ;
  clientId?: string;
  messages?: Message[];
  joinedRooms?: Room[];
}

export interface UserData {
  lastName: string;
  firstName: string;
  profileImage: string;
}
