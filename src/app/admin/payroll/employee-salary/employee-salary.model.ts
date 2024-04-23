export class EmployeeSalary {
  _id: string;
  netSalary: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    Matricule: string;
    poste: {
      _id: string;
      PostName: string;
    };
  };

  constructor(data: any) {
    this._id = data._id;
    this.netSalary = data.netSalary;
    this.user = {
      _id: data.user._id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email: data.user.email,
      Matricule: data.user.Matricule,
      poste: {
        _id: data.user.poste._id,
        PostName: data.user.poste.PostName
      }
    };
  }
}

 
 

