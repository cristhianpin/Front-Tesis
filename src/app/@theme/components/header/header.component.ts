import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../@core/utils';

import { environment } from '../../../../environments/environment';
import { BaseComponent } from '../../../@core/shared/component/base.component';
import { MenuItem } from '../../../@core/shared/model/menu-item.model';
import { IUser } from '../../../@core/shared/model/user.model';
import { RestResponse } from '../../../@core/shared/response/rest-response.model';
import { ChangePasswordFormComponent } from '../../../pages/my-account/change-password-form/change-password-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { AuthService } from '../../../@core/shared/service/auth.service';
import { getRoleLabel } from '../../../@core/shared/enum/role.enum';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent extends BaseComponent implements OnInit, OnDestroy {
  private wsServerUrl = `${environment.REST_URL}ws`;
  private wsMessageTopic = '/message';
  private wsNotificationTopic = '/notification';
  private wsSendMessageService = '/app/send/message';
  private wsSendNotificationService = '/app/send/notification';
  private stompClient: any;

  private isLoaded = false;

  private notifications: Notification[] = [];

  public numberOfNewNotifications: number;

  private destroy$: Subject<void> = new Subject<void>();
  public userPictureOnly = false;

  public currentUser: IUser;

  public themes = [
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  public currentTheme = 'corporate';

  public notificationMenu = [
    // {
    //   title: 'Opciones',
    //   icon: 'options-2-outline',
    //   link: '/pages/my-account/my-account-info',
    // },
    {
      title: 'Bandeja',
      icon: 'email-outline',
      badge: {
        status: 'warning',
        text: '0',
        position: 'top right',
      },
      // link: '../authentication/sign-out', debe ir a lista de bandeja mensajes
    },
  ];

  public languageMenu: MenuItem[] = [];

  public userMenu = [
    {
      title: 'Mi Cuenta',
      icon: 'person-done-outline',
      link: '/pages/my-account/my-account-info',
    },
    // {
    //   title: 'Actividad',
    //   icon: 'activity-outline',
    //   link: '/pages/my-account/my-account-info',
    // },
    {
      title: 'Salir',
      icon: 'log-out-outline',
      link: '../authentication/sign-out',
    },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authenticationService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private communicationService: CommunicationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.translateMenuOptions();
    this.initTranslateMenuClickEvents();
    this.initValues();

    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl));

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initValues(): void {
    this.numberOfNewNotifications = 0;

    this.authenticationService.findAuth().subscribe((res: any) => {
      if (res) {
        this.logger.debug('header, user: ', res);
        console.log('res.data', res.data);
        this.currentUser = res.data;

        this.initSubscriptors();
      }
    });
  }

  private initSubscriptors(): void {
    const createRecord$ = this.communicationService.movementComponent.subscribe((res) => {
      if (res) {
        this.destroySubscriptors();
        this.initValues();
      }
    });
    this.subscriptions.push(createRecord$);

    const createRecordBooking$ = this.communicationService.bookingComponent.subscribe((res) => {
      if (res) {
        this.destroySubscriptors();
        this.initValues();
      }
    });
    this.subscriptions.push(createRecordBooking$);

    const createSaleComponent$ = this.communicationService.saleComponent.subscribe((res) => {
      if (res) {
        this.destroySubscriptors();
        this.initValues();
      }
    });
    this.subscriptions.push(createSaleComponent$);
  }

  private translateMenuOptions(): void {
    this.languageMenu = [];
    this.translateService
      .getLangs()
      .forEach((lang) => this.languageMenu.push({ icon: 'flag-outline', title: lang, key: lang }));
    this.languageMenu.forEach((menuOption) =>
      this.translateService.get(`header.${menuOption.key}`).subscribe((translatedTitle) => {
        if (translatedTitle) {
          menuOption.title = translatedTitle;
        }
      }),
    );
  }

  private initTranslateMenuClickEvents(): void {
    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'langMenu'),
        map(({ item: { key } }: any) => key),
        takeUntil(this.destroy$),
      )
      .subscribe((key) => {
        this.setLanguage(key);
        this.translateMenuOptions();
      });
  }

  private setLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  changeTheme(themeName: string): void {
    this.themeService.changeTheme(themeName);
  }

  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  public toggleUibar(): boolean {
    this.logger.debug('toggle UI');

    this.router.navigate(['company/list'], {
      relativeTo: this.activatedRoute,
    });
    // this.sidebarService.toggle(false, 'ui-sidebar');
    // this.layoutService.changeLayoutSize();
    return false;
  }

  public navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }

  // Open modal
  public openChangePassword(): void {
    const modal = this.dialogService.open(ChangePasswordFormComponent, {
      context: {},
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        this.handleModalResponse(res);
      }
    });
  }

  private handleModalResponse(response: RestResponse): void {
    super.showToast(response.message.severity.toLowerCase(), response.message.title, response.message.body);
  }
  // Open modal
  protected readonly getRoleLabel = getRoleLabel;
}
