export enum AttendanceStatus {
    Absent = 0,
    HalfDay = 0.5,
    Present = 1,
  }
  
  export enum Etat {
    Pending = 'Pending',
    Approved = 'Approved',
    Declined = 'Declined',
  }
  
  export class Attendance {
    date!: Date;
    etat!: Etat;
    status!: AttendanceStatus;
  }
  