export class Performance {
    _id?:string
    score?: number = 0;
    Objective?: string;
    EmployeeEmail?: string;
    lastName?: string;
    firstName?: string;
    satisfactionLevel: SatisfactionLevel = SatisfactionLevel.Neutral;
}
export enum SatisfactionLevel {
    ExtremelyDissatisfied = -4,
    VeryDissatisfied = -3,
    ModeratelyDissatisfied = -2,
    SlightlyDissatisfied = -1,
    Neutral = 0,
    SlightlySatisfied = 1,
    ModeratelySatisfied = 2,
    VerySatisfied = 3,
    ExtremelySatisfied = 4
  }