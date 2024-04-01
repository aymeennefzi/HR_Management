// job.model.ts

export class JobsList {
  _id!: string; // Facultatif si vous prévoyez d'utiliser l'identifiant de l'offre d'emploi dans l'application frontend
  title!: string;
  description!: string;
  requiredSkills!: string[];
  location!: string;
  contractType!: string;
  salary!: number;
  applicationDeadline!: Date;
  status!: string;
  publicationDate!: Date;
  recruitingManager!: string;
  applicants!: string[];
}
export class Skill {
  
  name: string = '';

}
