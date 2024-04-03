import { taskPriority, TypeStatutTache } from "app/admin/projects/all-projects/core/project.model";

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