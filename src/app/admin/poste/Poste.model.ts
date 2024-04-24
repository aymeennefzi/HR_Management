import { User } from "@core";
import { id } from "@swimlane/ngx-charts";

export interface CreateUserPostDto {
    _id:string;
    name: string;
    email?: string;
    password?: string;
    PostId: string;
  }
  
  export interface Poste {
    _id:string;
    BasicSalary: number;
    PostName: string;
    Workshour: number;
    Users?: UserWithoutPost[];
  }
  export interface UserWithoutPost {
    id: string;
    firstName: string;
    lastName: string;
  }