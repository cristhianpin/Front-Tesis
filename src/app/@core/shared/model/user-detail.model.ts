export class IUserDetail {
  id: string;
  firstName: string;
  lastName: string;
  roleName: string;
  email: string;
  isEnabled: boolean;
  idNumber: string;
  phone: string;
  birthDate: string;
  address: string;
  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.idNumber = data.id_number;
    this.phone = data.phone;
    this.birthDate = data.birth_date;
    this.address = data.address;
    this.roleName = data.user?.role;
    this.email = data.user?.email;
  }
}
