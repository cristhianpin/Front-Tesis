import { Component, OnDestroy, OnInit } from '@angular/core';

import { BaseComponent } from '../../../@core/shared/component/base.component';
import { ICompany } from '../../../@core/shared/model/company.model';
import { IUser } from '../../../@core/shared/model/user.model';
import { UserService } from '../../../@core/shared/service/user.service';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { MfaFormComponent } from '../mfa-form/mfa-form.component';

@Component({
  selector: 'ngx-my-account-info',
  templateUrl: './my-account-info.component.html',
  styleUrls: ['./my-account-info.component.scss'],
})
export class MyAccountInfoComponent extends BaseComponent implements OnInit, OnDestroy {
  public user: IUser;

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.loadUserInfo();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private initValues(): void {
    this.user = {} as IUser;
    this.user.Company = {} as ICompany;
  }

  private loadUserInfo(): void {
    this.logger.debug('loadUserInfo');
    this.showSpinner = true;
    const myAccount$ = this.userService.find(this.loggedInUser.id).subscribe((res: any) => {
      if (res) {
        this.user = res.data;
        this.user.firstName = res.data.first_name;
        this.user.lastName = res.data.last_name;
        this.user.email = res.data.user?.email;
        this.logger.debug('loadUserInfo, user: ', this.user);
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(myAccount$);
  }

  // Open modal
  public openChangePassword(): void {
    const modal = this.dialogService.open(ChangePasswordFormComponent, {
      context: {
        // operation: 'U',
        // objIdModal: '-1',
        modalStyle: 'width: 40em; height: 41em;',
        modalSeverity: 'primary',
        isModal: true,
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        //this.handleModalResponse(res);
      }
    });
  }

  // public openMFA(): void {
  //   const modal = this.dialogService.open(MfaFormComponent, {
  //     context: {
  //       usingMFA: this.user.usingMFA,
  //     },
  //     autoFocus: false,
  //     hasScroll: true,
  //     hasBackdrop: true,
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  //   modal.onClose.subscribe((res) => {
  //     // if (res) {
  //     //   this.handleMFAModalResponse(res);
  //     //   if (!res.hasError) {
  //     //     this.loadUserInfo();
  //     //   }
  //     // }
  //     this.loadUserInfo();
  //   });
  // }

  private handleModalResponse(response: any): void {
    this.logger.debug('After close modal, res : ', response);
    super.showToast(response.message.severity.toLowerCase(), response.message.title, response.message.body);
  }

  private handleMFAModalResponse(response: any): void {
    this.logger.debug('After close MFA modal, res : ', response);
    let severity = 'success';
    if (response.hasError) {
      severity = 'danger';
    }
    super.showToast(severity, 'mfa.title-mfa', response.message);
  }
  // Open modal
}
