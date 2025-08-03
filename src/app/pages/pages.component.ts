import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { IJwtUser } from '../@core/shared/model/jwt-user.model';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subscription } from 'rxjs';
import { MenuItem } from '../@core/shared/model/menu-item.model';
import { isGranted } from '../@core/utils/role-validation';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public menu: MenuItem[];
  public originalMenu: MenuItem[];

  public currentUser: IJwtUser;

  public readonly ROLE_PREFIX = 'ROLE_';

  constructor(private translateService: TranslateService, private authService: NbAuthService) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.currentUser = token.getPayload();
      }
    });
  }

  ngOnInit(): void {
    this.menu = MENU_ITEMS;
    this.createMenu();
    this.translateMenu();
    const langChange$ = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateMenu();
    });
    this.subscriptions.push(langChange$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  public createMenu(): void {
    this.applyPermission(this.menu);
  }

  private applyPermission(menu: MenuItem[]): void {
    menu.forEach((menuItem: MenuItem) => {
      if (menuItem.group) {
        menuItem.hidden = false;
      } else {
        if (isGranted(menuItem.roles, this.currentUser.scopes)) {
          menuItem.hidden = false;
        } else {
          menuItem.hidden = true;
        }
        if (menuItem.children) {
          this.applyPermission(menuItem.children);
        }
      }
    });
  }

  public translateMenu(): void {
    this.menu.forEach((menuItem: MenuItem) => {
      this.translateMenuTitle(menuItem);
    });
  }

  private translateMenuTitle(menuItem: MenuItem, prefix = ''): void {
    let key = '';
    try {
      key = prefix !== '' ? PagesComponent.getMenuItemKey(menuItem, prefix) : PagesComponent.getMenuItemKey(menuItem);
    } catch (e) {
      return;
    }
    this.translateService.get(key).subscribe((translation: string) => {
      menuItem.title = translation;
    });
    if (menuItem.children != null) {
      menuItem.children.forEach((childMenuItem: MenuItem) => {
        this.translateMenuTitle(childMenuItem, PagesComponent.trimLastSelector(key));
      });
    }
  }

  private static getMenuItemKey(menuItem: MenuItem, prefix = 'menu'): string {
    if (menuItem.key == null) {
      throw new Error('Key not found');
    }
    const key = menuItem.key.toLowerCase();
    if (menuItem.children != null) {
      return prefix + '.' + key + '.' + key;
    }
    return prefix + '.' + key;
  }

  private static trimLastSelector(key: string): string {
    const keyParts = key.split('.');
    keyParts.pop();
    return keyParts.join('.');
  }
}
