import { User } from '@core';
import { Message } from './message';

export interface Room {
  _id?: string;
  name?: string;
  messages?: Message[];
  connectedUsers?: User[];
}
