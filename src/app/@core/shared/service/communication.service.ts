import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IMovement } from '../model/movement.model';
import { ITablePreference } from '../model/table-preference.model';
import { IUserPreference } from '../model/user-preference.model';
import { ISale } from '../model/sale.model';
import { IBooking } from '../model/booking.model';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  public userPreferenceComponent = new Subject<any>();
  public tablePreferenceComponent = new Subject<ITablePreference>();
  // public platformCompanyComponent = new Subject<IPlatformCompany>();
  public movementComponent = new Subject<IMovement>();
  public saleComponent = new Subject<any>();
  public bookingComponent = new Subject<any>();
  // public accountComponent = new Subject<IAccount>();

  public updateUserPreferenceComponent(userPreference: IUserPreference): void {
    this.userPreferenceComponent.next(userPreference);
  }

  public updateTablePreferenceComponent(tablePreference: ITablePreference): void {
    // tablePreference.toggleCols = JSON.parse(tablePreference.cols);
    this.tablePreferenceComponent.next(tablePreference);
  }

  // public updatePlatformCompanyComponent(platformCompany: IPlatformCompany): void {
  //   this.platformCompanyComponent.next(platformCompany);
  // }

  public createMovementComponent(movement: IMovement): void {
    this.movementComponent.next(movement);
  }

  public createSaleComponent(sale: any): void {
    this.saleComponent.next(sale);
  }

  public createBookingComponent(booking: any): void {
    this.bookingComponent.next(booking);
  }

  public updateMovementComponent(movement: IMovement): void {
    this.movementComponent.next(movement);
  }

  // public updateAccountComponent(account: IAccount): void {
  //   this.accountComponent.next(account);
  // }
}
