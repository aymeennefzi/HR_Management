export enum LeaveType {
  SickLeave = 'Sick Leave',
  PaidLeave = 'paid leave',
  Unpaidleave = 'Unpaid leave',
  Bereavement = 'Bereavement',
  PersonalReasons = 'Personal Reasons',
  Maternity = 'Maternity',
  Paternity = 'Paternity',
  RTT = 'RTT' ,
  Other = 'Other',
}
export enum Status {
  Pending= 'Pending',
  Approved = 'Approved',
  Declined = 'Declined'
}

export enum TimeOfDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  noone = 'No One',
}

export class Leaves {
  _id  !: string;
  leaveType!: LeaveType;
  startDate!: string;
  endDate!: string;
  reason!: string;
  status!: Status;
  startTime !: TimeOfDay ;
  endTime !: TimeOfDay ;
  personnelId!:String;
  userName?: string; 
  numOfDays !: number ;
}

export interface User {
  _id: string;
  name: string;
  leaves: Leaves[];
}
