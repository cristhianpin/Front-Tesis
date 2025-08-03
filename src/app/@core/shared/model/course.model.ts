export class ICourse {
  id: string;
  name: string;
  description: string;
  total_seats: string;
  start_date: string;
  end_date: string;
  isEnabled: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name; // Se transforma first_name a firstName
    this.description = data.description; // Se transforma last_name a lastName
    this.total_seats = data.total_seats;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
  }
}
