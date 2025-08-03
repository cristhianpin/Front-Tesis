import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import { BaseComponent } from '../../../@core/shared/component/base.component';
import { IUserPreference } from '../../../@core/shared/model/user-preference.model';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { UserPreferenceService } from '../../../@core/shared/service/user-preference.service';

@Component({
  selector: 'ngx-ui-sidebar',
  styleUrls: ['./ui-sidebar.component.scss'],
  templateUrl: './ui-sidebar.component.html',
})
export class UiSidebarComponent extends BaseComponent implements OnInit, OnDestroy {
  public obj: IUserPreference;
  public isDark = false;

  public layouts = [];
  public sidebars = [];

  constructor(
    private themeService: NbThemeService,
    private userPreferenceService: UserPreferenceService,
    private communicationService: CommunicationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');

    this.initValues();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
  }

  private initValues(): void {
    this.initObjs();
    this.userPreferenceService.findByUser().subscribe((res: IUserPreference) => {
      if (res) {
        this.obj = res;
        if (this.obj.theme.toLowerCase() === 'dark') {
          this.isDark = true;
        }
        this.communicationService.updateUserPreferenceComponent(res);
        this.logger.debug('userPreference: ', this.obj);
        this.logger.debug('isDark: ', this.isDark);
      }
    });
  }

  private initObjs(): void {
    this.obj = {} as IUserPreference;
  }

  public onChangeTheme(isDark: boolean): void {
    this.logger.debug('changeTheme to dark: ', isDark);
    let theme = 'corporate';
    this.isDark = false;
    if (isDark) {
      theme = 'dark';
      this.isDark = true;
    }
    this.obj.theme = theme.toUpperCase();
    this.themeService.changeTheme(theme);
    this.updateUserPreference();
  }

  public onSelectLanguage(language: string): void {
    this.logger.debug('onSelectLanguage: ', language);
    this.obj.language = language;
    this.updateUserPreference();
  }

  private updateUserPreference(): void {
    this.logger.debug('updateUserPreference');
    this.userPreferenceService.update(this.obj).subscribe((res: IUserPreference) => {
      if (res) {
        this.communicationService.updateUserPreferenceComponent(res);
        super.showToastWithIcon(
          'Las preferencias de usuario se actualizaron exitosamente',
          'Preferencias actualizadas',
          'success',
        );
      }
    });
  }
}
