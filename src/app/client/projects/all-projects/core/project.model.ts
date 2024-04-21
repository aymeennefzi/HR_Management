import { Injectable } from '@angular/core';
import { User } from '@core';
import { Adapter } from './adapters';
export enum TypeStatutProjet {
  New = 0,
  RUNNING = 1,

  FINISHED = 3,
}
export enum TypeStatutTache{
  A_FAIRE = 'To Do',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}



export enum ProjectPriority {
  LOW = -1,
  MEDIUM = 0,
  HIGH = 1,
}
export enum taskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
export enum ProjectType {
  WEB = 'Website',
  ANDROID = 'Android',
  IPHONE = 'IPhone',
  TESTING = 'Testing',
}



@Injectable({
  providedIn: 'root',
})

export class ProjectMdel {
  _id!:string;
  NomProject!: string;
description?: string;
StartDate?: Date;
FinishDate?: Date;
statut?: TypeStatutProjet;
projectUrl?: string;
tasks?: TasksModel[];
NomChefProjet?: string;
priority?: ProjectPriority ;
progress?:number;
UserProjectsId?:string;
type?:ProjectType
}
export class TasksModel {
  _id?:string
  NomTask!: string;
  description?: string;
  startDate?: Date; // Assuming you want to store dates as strings
  FinishDate?: Date; // Assuming you want to store dates as strings
  statut?:TypeStatutTache;
  projectId!: string;
  priority?: taskPriority ;
  employeeAffected!: string;
}
