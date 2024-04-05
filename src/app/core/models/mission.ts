import { User } from "./user";


export enum MissionStatus {
  Ongoing = 'ongoing',
  Completed = 'completed',
  Canceled = 'canceled',
  Pending = 'pending',
}

export interface Mission {
  _id?: string |undefined; 
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: MissionStatus;
  assignedTo: User[]; 
}
